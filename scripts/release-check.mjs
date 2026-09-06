import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

import { getAllBlogPosts } from '../src/content/blog/metadata.ts';
import {
  canCommitRequest,
  getArticleHeadingScrollTarget,
} from '../src/lib/multilingualReading.ts';
import { getIndexablePaths, localePath } from '../src/lib/localeRoutes.ts';

const baseUrl = new URL(process.env.BASE_URL ?? 'http://127.0.0.1:3000');
const origin = baseUrl.origin;
const locales = ['en', 'ko', 'ja'];
const posts = Object.fromEntries(locales.map((locale) => [locale, getAllBlogPosts(locale)]));
const results = [];
let failures = 0;

function urlFor(pathname) {
  return new URL(pathname, origin).toString();
}

function requireCondition(condition, message) {
  assert.ok(condition, message);
}

function record(name, status, detail) {
  const result = { check: name, status, ...(detail ? { detail } : {}) };
  results.push(result);
  console.log(JSON.stringify(result));
}

async function check(name, operation) {
  try {
    await operation();
    record(name, 'pass');
  } catch (error) {
    failures += 1;
    record(name, 'fail', error instanceof Error ? error.message : String(error));
  }
}

async function get(pathname, options = {}) {
  const response = await fetch(urlFor(pathname), options);
  return { response, body: await response.text() };
}

function canonicalFromHtml(html) {
  const link = html.match(/<link\b[^>]*>/gi)?.find((candidate) => /\brel=["']canonical["']/i.test(candidate));
  return link?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? null;
}

function assertPageHtml(pathname, body, locale, canonicalPath) {
  requireCondition(body.includes(`<html lang="${locale}"`), `${pathname}: expected html lang=${locale}`);
  requireCondition(body.includes('<body'), `${pathname}: missing server body`);
  requireCondition(body.includes('<main'), `${pathname}: missing server main`);
  const canonical = canonicalFromHtml(body);
  requireCondition(canonical === urlFor(canonicalPath), `${pathname}: canonical ${canonical ?? 'missing'} != ${urlFor(canonicalPath)}`);
  requireCondition(!body.includes('TechPulse'), `${pathname}: stale TechPulse brand in server HTML`);
}

await check('canonical-routes-45', async () => {
  const paths = getIndexablePaths(posts.en.map((post) => post.id));
  requireCondition(paths.length === 45, `expected 45 canonical routes, found ${paths.length}`);

  const responses = await Promise.all(paths.map(async (pathname) => ({ pathname, ...(await get(pathname)) })));
  for (const { pathname, response, body } of responses) {
    requireCondition(response.status === 200, `${pathname}: expected 200, got ${response.status}`);
    const locale = pathname.split('/')[1];
    assertPageHtml(pathname, body, locale, pathname);
  }
});

await check('server-article-html-36', async () => {
  const routes = locales.flatMap((locale) => posts[locale].map((post) => ({
    locale,
    post,
    pathname: localePath(locale, `/blog/${post.id}`),
  })));
  requireCondition(routes.length === 36, `expected 36 localized article routes, found ${routes.length}`);

  const responses = await Promise.all(routes.map(async (route) => ({ route, ...(await get(route.pathname)) })));
  for (const { route, response, body } of responses) {
    requireCondition(response.status === 200, `${route.pathname}: expected 200, got ${response.status}`);
    assertPageHtml(route.pathname, body, route.locale, route.pathname);
    requireCondition(/<article\b/i.test(body), `${route.pathname}: missing article`);
    requireCondition(/<h1\b/i.test(body), `${route.pathname}: missing article H1`);
    requireCondition(body.includes(route.post.title), `${route.pathname}: missing localized article title`);
    requireCondition(body.includes(route.post.excerpt), `${route.pathname}: missing localized article body text`);
  }
});

await check('legacy-routes-15', async () => {
  const paths = ['/', '/about', '/blog', ...posts.en.map((post) => `/blog/${post.id}`)];
  requireCondition(paths.length === 15, `expected 15 legacy routes, found ${paths.length}`);
  const responses = await Promise.all(paths.map(async (pathname) => ({ pathname, ...(await get(pathname)) })));
  for (const { pathname, response, body } of responses) {
    requireCondition(response.status === 200, `${pathname}: expected 200, got ${response.status}`);
    assertPageHtml(pathname, body, 'en', localePath('en', pathname));
  }
});

await check('markdown-routes-36', async () => {
  const routes = locales.flatMap((locale) => posts[locale].map((post) => `/blog/content/${post.slug}`));
  requireCondition(routes.length === 36, `expected 36 Markdown routes, found ${routes.length}`);
  const responses = await Promise.all(routes.map(async (pathname) => ({ pathname, ...(await get(pathname)) })));
  for (const { pathname, response, body } of responses) {
    requireCondition(response.status === 200, `${pathname}: expected 200, got ${response.status}`);
    requireCondition(response.headers.get('content-type')?.startsWith('text/markdown'), `${pathname}: expected Markdown content type`);
    requireCondition(body.startsWith('# '), `${pathname}: expected Markdown H1`);
    requireCondition(body.length > 300, `${pathname}: Markdown body is unexpectedly short`);
  }
});

await check('profile-redirect-policy', async () => {
  const redirects = [
    ['/profile', '/about'],
    ['/en/profile', '/en/about'],
    ['/ko/profile', '/ko/about'],
    ['/ja/profile', '/ja/about'],
  ];
  for (const [pathname, expectedPath] of redirects) {
    const { response } = await get(pathname, { redirect: 'manual' });
    requireCondition(response.status >= 300 && response.status < 400, `${pathname}: expected redirect, got ${response.status}`);
    requireCondition(new URL(response.headers.get('location') ?? '', origin).toString() === urlFor(expectedPath), `${pathname}: unexpected Location`);
  }
});

await check('regression-routes', async () => {
  for (const pathname of ['/robots.txt', '/sitemap.xml', '/icon.svg', '/opengraph-image.svg', '/blog?page=2', '/ko/blog?page=2&category=rendering']) {
    const { response } = await get(pathname);
    requireCondition(response.status === 200, `${pathname}: expected 200, got ${response.status}`);
  }

  const { response: sitemapResponse, body: sitemap } = await get('/sitemap.xml');
  const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedSitemap = new Set(getIndexablePaths(posts.en.map((post) => post.id)).map(urlFor));
  requireCondition(sitemapLocations.length === 45, `sitemap must contain 45 canonical URLs, found ${sitemapLocations.length}`);
  requireCondition(sitemapLocations.every((location) => expectedSitemap.has(location)), 'sitemap must contain only canonical URLs');
  requireCondition(sitemapLocations.every((location) => location.startsWith(origin)), 'sitemap URLs must use the configured canonical host');
  requireCondition(sitemapResponse.headers.get('content-type')?.includes('xml'), 'sitemap must be XML');

  const { response: robotsResponse, body: robots } = await get('/robots.txt');
  requireCondition(robots.includes(`${origin}/sitemap.xml`), 'robots must advertise the canonical sitemap URL');
  requireCondition(robotsResponse.headers.get('content-type')?.startsWith('text/plain'), 'robots must be plain text');

  const { response: missingResponse } = await get('/release-readiness-missing-route');
  requireCondition(missingResponse.status === 404, `missing route expected 404, got ${missingResponse.status}`);
});

await check('fault-injection-timeout-retry-latest-wins', () => {
  requireCondition(!canCommitRequest(1, 2, 1000, 1400), 'stale request committed during latest-wins injection');
  requireCondition(canCommitRequest(2, 2, 2000, 4999), 'latest request failed before timeout boundary');
  requireCondition(!canCommitRequest(3, 3, 2000, 7000), 'timeout request committed at or after 5000 ms');
  requireCondition(canCommitRequest(4, 4, 8000, 8999), 'retry request did not commit before timeout');
  requireCondition(getArticleHeadingScrollTarget(800, -32, 2600, 800) === 768, 'heading offset was not converted to document position');
});

function findBrowser() {
  const candidates = [process.env.BROWSER_BIN, 'chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'].filter(Boolean);
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
    try {
      return execFileSync('which', [candidate], { encoding: 'utf8' }).trim();
    } catch {
      // Try the next supported binary.
    }
  }
  return null;
}

const browser = findBrowser();
if (!browser) {
  record('browser.375px', 'skip', 'No supported headless Chromium binary is installed; server HTML checks still ran.');
  record('browser.1440px', 'skip', 'No supported headless Chromium binary is installed; server HTML checks still ran.');
  record('browser.korean-hydration-console-errors', 'skip', 'Console instrumentation requires a browser/CDP dependency absent from this repository.');
} else {
  for (const width of [375, 1440]) {
    await check(`browser.${width}px`, () => {
      const body = execFileSync(browser, [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--dump-dom',
        `--window-size=${width},900`,
        '--virtual-time-budget=5000',
        urlFor('/ko/blog/react-reconciliation'),
      ], { encoding: 'utf8', timeout: 20000, maxBuffer: 10 * 1024 * 1024 });
      requireCondition(body.includes('<html lang="ko"'), `browser ${width}px: Korean document lang missing`);
      requireCondition(/<article\b/i.test(body), `browser ${width}px: article missing`);
      requireCondition(/<h1\b/i.test(body), `browser ${width}px: H1 missing`);
    });
  }
  record('browser.korean-hydration-console-errors', 'skip', 'DOM validation ran at both viewports; console instrumentation requires a browser/CDP dependency absent from this repository.');
}

const passed = results.filter((result) => result.status === 'pass').length;
const skipped = results.filter((result) => result.status === 'skip').length;
record('summary', failures ? 'fail' : 'pass', `${passed} passed, ${skipped} skipped, ${failures} failed`);
process.exitCode = failures ? 1 : 0;
