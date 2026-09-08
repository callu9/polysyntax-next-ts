import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { getAllBlogPosts } from '../src/content/blog/metadata.ts';
import { getBlogContentBySlug } from '../src/content/blog/content.ts';
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

function assertSingleArticleStructuredData(pathname, body) {
  const scripts = [...body.matchAll(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
  requireCondition(scripts.length === 1, `${pathname}: expected one Article/Breadcrumb JSON-LD script, found ${scripts.length}`);
  requireCondition(
    scripts[0]?.['@graph']?.some((entry) => entry['@type'] === 'Article') && scripts[0]?.['@graph']?.some((entry) => entry['@type'] === 'BreadcrumbList'),
    `${pathname}: expected one Article/Breadcrumb JSON-LD graph`,
  );
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
    if (pathname === '/blog/react-reconciliation') assertSingleArticleStructuredData(pathname, body);
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
  const candidates = [
    process.env.BROWSER_BIN,
    'chromium',
    'chromium-browser',
    'google-chrome',
    'google-chrome-stable',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(url, timeoutMs = 1000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function getBrowserState(client) {
  const result = await client.command('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const article = document.querySelector('article');
      const headings = [...(article?.querySelectorAll('h2, h3') ?? [])];
      const heading = headings[2];
      const articleTop = article ? window.scrollY + article.getBoundingClientRect().top : null;
      return {
        pathname: window.location.pathname,
        lang: document.documentElement.lang,
        h1: document.querySelector('h1')?.textContent ?? '',
        body: article?.textContent ?? '',
        storage: localStorage.getItem('language-storage'),
        scrollY: window.scrollY,
        headingTop: heading?.getBoundingClientRect().top ?? null,
        articleTop,
        articleHeight: article?.scrollHeight ?? null,
        documentHeight: document.documentElement.scrollHeight,
        viewport: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollCalls: window.__polySyntaxScrollCalls ?? [],
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    })()`,
  });
  return result.result?.value ?? null;
}

async function waitForArticle(client, pathname, post, timeoutMs = 15000) {
  const contentMarker = getBlogContentBySlug(post.slug).split('\n').find((line) => line && !line.startsWith('#'));
  const deadline = Date.now() + timeoutMs;
  let state = null;
  while (Date.now() < deadline) {
    try {
      state = await getBrowserState(client);
      if (state?.pathname === pathname && state.lang === post.language && state.h1 === post.title && state.body.includes(contentMarker)) break;
    } catch {
      // Navigation can briefly destroy the evaluation context.
    }
    await delay(100);
  }
  return state;
}

async function waitForEvent(client, method, offset, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const event = client.events.slice(offset).find((candidate) => candidate.method === method);
    if (event) return event;
    await delay(50);
  }
  throw new Error(`Timed out waiting for ${method}`);
}

async function selectLanguage(client, triggerLabel, itemLabel) {
  const trigger = await client.command('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const button = [...document.querySelectorAll('button[aria-haspopup="menu"]')].find((candidate) => candidate.textContent?.trim() === ${JSON.stringify(triggerLabel)});
      button?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }));
      return Boolean(button);
    })()`,
  });
  if (!trigger.result?.value) throw new Error(`${triggerLabel} language menu trigger was not found`);
  await delay(100);
  const selection = await client.command('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const item = [...document.querySelectorAll('[role="menuitem"]')].find((candidate) => candidate.textContent?.trim() === ${JSON.stringify(itemLabel)});
      item?.click();
      return Boolean(item);
    })()`,
  });
  if (!selection.result?.value) throw new Error(`${itemLabel} language menu item was not found`);
}

async function waitForPage(userDataDir, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = 'browser target was not available';
  while (Date.now() < deadline) {
    try {
      const [port] = readFileSync(join(userDataDir, 'DevToolsActivePort'), 'utf8').trim().split('\n');
      if (port) {
        const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
        const page = targets.find((target) => target.type === 'page');
        if (page?.webSocketDebuggerUrl) return page;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await delay(100);
  }
  throw new Error(lastError);
}

class DevToolsClient {
  constructor(url) {
    this.url = url;
    this.nextId = 0;
    this.pending = new Map();
    this.events = [];
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(String(data));
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
        return;
      }
      this.events.push(message);
    });
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', () => reject(new Error('could not connect to browser DevTools')), { once: true });
    });
  }

  command(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket?.close();
  }
}

function eventDetails(event) {
  if (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') {
    return `console.error: ${event.params.args.map((arg) => arg.value ?? arg.description ?? '').join(' ')}`;
  }
  if (event.method === 'Runtime.exceptionThrown') {
    return `uncaught exception: ${event.params.exceptionDetails.text}`;
  }
  if (event.method === 'Log.entryAdded' && event.params.entry.level === 'error') {
    return `browser log error: ${event.params.entry.text}`;
  }
  return null;
}

async function runBrowserPage(browserPath, pathname, width, persistedLanguage, positionMode) {
  const userDataDir = mkdtempSync(join(tmpdir(), 'polysyntax-release-browser-'));
  const child = spawn(browserPath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},900`,
    'about:blank',
  ], { detached: true, stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  try {
    const target = await waitForPage(userDataDir);
    client = new DevToolsClient(target.webSocketDebuggerUrl);
    await client.connect();
    await client.command('Runtime.enable');
    await client.command('Log.enable');
    await client.command('Network.enable');
    await client.command('Page.enable');
    await client.command('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: width,
      screenHeight: 900,
    });

    await client.command('Page.navigate', { url: urlFor('/') });
    await delay(300);
    const storage = persistedLanguage
      ? `localStorage.setItem('language-storage', ${JSON.stringify(JSON.stringify({ state: { language: persistedLanguage }, version: 0 }))})`
      : "localStorage.removeItem('language-storage')";
    await client.command('Runtime.evaluate', { expression: storage });
    await client.command('Page.navigate', { url: urlFor(pathname) });

    const expectedPathname = persistedLanguage ? '/ja/blog/react-reconciliation' : pathname;
    const expectedPost = persistedLanguage ? posts.ja.find((post) => post.id === 'react-reconciliation') : posts.ko.find((post) => post.id === 'react-reconciliation');
    const initialState = await waitForArticle(client, expectedPathname, expectedPost);
    let state = initialState;
    let switchMarkdownRequests = [];
    let positionRatio = null;
    if (positionMode === 'cancel-reselect') {
      await client.command('Fetch.enable', { patterns: [{ urlPattern: '*://*/blog/content/*-ja' }] });
      const switchEventOffset = client.events.length;
      await selectLanguage(client, 'KO', '日本語');
      const pausedRequest = await waitForEvent(client, 'Fetch.requestPaused', switchEventOffset);
      await selectLanguage(client, 'JA', '한국어');
      try {
        await client.command('Fetch.failRequest', { requestId: pausedRequest.params.requestId, errorReason: 'Aborted' });
      } catch {
        // The AbortController may have already canceled the paused request.
      }
      await client.command('Fetch.disable');
      await delay(100);
      await selectLanguage(client, 'KO', '日本語');
      const switchedPost = posts.ja.find((post) => post.id === 'react-reconciliation');
      state = await waitForArticle(client, '/ja/blog/react-reconciliation', switchedPost);
      switchMarkdownRequests = client.events
        .slice(switchEventOffset)
        .filter((event) => event.method === 'Network.requestWillBeSent')
        .map((event) => new URL(event.params.request.url).pathname)
        .filter((requestPath) => requestPath.startsWith('/blog/content/'));
    } else if (positionMode) {
      const positionResult = await client.command('Runtime.evaluate', {
        expression: `(() => {
          const article = document.querySelector('article');
          if (!article) return;
          window.__polySyntaxScrollCalls = [];
          const scrollTo = window.scrollTo.bind(window);
          window.scrollTo = (...args) => { window.__polySyntaxScrollCalls.push(args); return scrollTo(...args); };
          if (${JSON.stringify(positionMode)} === 'heading') {
            const heading = article.querySelectorAll('h2, h3')[2];
            if (heading) window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top });
            return;
          }
          const querySelectorAll = Element.prototype.querySelectorAll;
          Element.prototype.querySelectorAll = function (selectors) {
            return this === article && selectors === 'h2, h3' ? [] : querySelectorAll.call(this, selectors);
          };
          const articleTop = window.scrollY + article.getBoundingClientRect().top;
          const ratio = 0.5;
          window.scrollTo({ top: articleTop + ratio * Math.max(0, article.scrollHeight - window.innerHeight) });
          return { ratio: (window.scrollY - articleTop) / Math.max(1, article.scrollHeight - window.innerHeight) };
        })()`,
        returnByValue: true,
      });
      positionRatio = positionResult.result?.value?.ratio ?? null;
      await delay(50);
      const switchEventOffset = client.events.length;
      const trigger = await client.command('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const button = [...document.querySelectorAll('button[aria-haspopup="menu"]')].find((candidate) => candidate.textContent?.trim() === 'KO');
          button?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }));
          return Boolean(button);
        })()`,
      });
      if (!trigger.result?.value) throw new Error('Korean language menu trigger was not found');
      await delay(100);
      const selection = await client.command('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const item = [...document.querySelectorAll('[role="menuitem"]')].find((candidate) => candidate.textContent?.trim() === '日本語');
          item?.click();
          return Boolean(item);
        })()`,
      });
      if (!selection.result?.value) throw new Error('Japanese language menu item was not found');
      const switchedPost = posts.ja.find((post) => post.id === 'react-reconciliation');
      state = await waitForArticle(client, '/ja/blog/react-reconciliation', switchedPost);
      await client.command('Runtime.evaluate', {
        expression: 'document.fonts.ready.then(() => true)',
        awaitPromise: true,
        returnByValue: true,
      });
      state = await getBrowserState(client);
      switchMarkdownRequests = client.events
        .slice(switchEventOffset)
        .filter((event) => event.method === 'Network.requestWillBeSent')
        .map((event) => new URL(event.params.request.url).pathname)
        .filter((requestPath) => requestPath.startsWith('/blog/content/'));
    }

    const errors = client.events.map(eventDetails).filter(Boolean);
    const markdownRequests = client.events
      .filter((event) => event.method === 'Network.requestWillBeSent')
      .map((event) => new URL(event.params.request.url).pathname)
      .filter((requestPath) => requestPath.startsWith('/blog/content/'));
    return { initialState, state, errors, markdownRequests, switchMarkdownRequests, positionRatio };
  } finally {
    client?.close();
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      child.kill('SIGKILL');
    }
    await delay(100);
    rmSync(userDataDir, { recursive: true, force: true });
  }
}

const browser = findBrowser();
const koreanBrowserResults = [];
for (const width of [375, 1440]) {
  await check(`browser.${width}px`, async () => {
    requireCondition(browser, 'No supported headless Chromium binary is installed');
    const result = await runBrowserPage(browser, '/ko/blog/react-reconciliation', width, undefined, width === 375 ? 'heading' : undefined);
    koreanBrowserResults.push(result);
    const post = posts.ko.find((candidate) => candidate.id === 'react-reconciliation');
    requireCondition(result.initialState?.viewport === width, `browser ${width}px: viewport was not applied`);
    requireCondition(result.initialState?.pathname === '/ko/blog/react-reconciliation', `browser ${width}px: unexpected URL`);
    requireCondition(result.initialState?.lang === 'ko', `browser ${width}px: Korean document lang missing`);
    requireCondition(result.initialState?.h1 === post.title, `browser ${width}px: localized H1 missing`);
    const contentMarker = getBlogContentBySlug(post.slug).split('\n').find((line) => line && !line.startsWith('#'));
    requireCondition(result.initialState?.body.includes(contentMarker), `browser ${width}px: localized article body missing`);
    requireCondition(!result.initialState?.overflow, `browser ${width}px: horizontal overflow detected`);
    if (width === 375) {
      requireCondition(result.state?.pathname === '/ja/blog/react-reconciliation', 'KO to JA switch did not update the URL');
      requireCondition(result.state?.lang === 'ja', 'KO to JA switch did not update document language');
      if (result.positionRatio === null) {
        requireCondition(Math.abs(result.state?.headingTop ?? Number.POSITIVE_INFINITY) <= 1, `KO to JA heading did not align at viewport top: ${result.state?.headingTop}`);
      } else {
        const expectedScroll = Math.min(
          Math.max(0, result.state?.articleTop + result.positionRatio * Math.max(0, result.state?.articleHeight - result.state?.viewportHeight)),
          Math.max(0, result.state?.documentHeight - result.state?.viewportHeight),
        );
        requireCondition(Math.abs((result.state?.scrollY ?? Number.POSITIVE_INFINITY) - expectedScroll) <= 1, `KO to JA ratio fallback was not restored after remount: expected ${expectedScroll}, got ${result.state?.scrollY}`);
      }
      requireCondition(result.switchMarkdownRequests.filter((requestPath) => requestPath.endsWith('-ja')).length === 1, 'KO to JA switch did not make exactly one JA Markdown request');
      requireCondition(result.switchMarkdownRequests.filter((requestPath) => requestPath.endsWith('-ko')).length === 0, 'KO to JA switch made a stale KO Markdown request');
    }
  });
}

await check('browser.ratio-fallback', async () => {
  requireCondition(browser, 'No supported headless Chromium binary is installed');
  const result = await runBrowserPage(browser, '/ko/blog/react-reconciliation', 375, undefined, 'ratio');
  requireCondition(result.state?.pathname === '/ja/blog/react-reconciliation', 'ratio fallback switch did not update the URL');
  requireCondition(result.positionRatio !== null, `ratio fallback setup did not capture a ratio: ${result.positionRatio}`);
  const expectedScroll = Math.min(
    Math.max(0, result.state?.articleTop + result.positionRatio * Math.max(0, result.state?.articleHeight - result.state?.viewportHeight)),
    Math.max(0, result.state?.documentHeight - result.state?.viewportHeight),
  );
  const restoredScroll = result.state?.scrollCalls?.at(-1)?.[0]?.top;
  requireCondition(Math.abs((restoredScroll ?? Number.POSITIVE_INFINITY) - expectedScroll) <= 1, `ratio fallback restore call was wrong: expected ${expectedScroll}, got ${restoredScroll}`);
  requireCondition(Math.abs((result.state?.scrollY ?? Number.POSITIVE_INFINITY) - expectedScroll) <= 5, `ratio fallback was not stable after remount: expected ${expectedScroll}, got ${result.state?.scrollY}`);
});

await check('browser.cancel-reselect', async () => {
  requireCondition(browser, 'No supported headless Chromium binary is installed');
  const result = await runBrowserPage(browser, '/ko/blog/react-reconciliation', 375, undefined, 'cancel-reselect');
  const post = posts.ja.find((candidate) => candidate.id === 'react-reconciliation');
  const contentMarker = getBlogContentBySlug(post.slug).split('\n').find((line) => line && !line.startsWith('#'));
  requireCondition(result.state?.pathname === '/ja/blog/react-reconciliation', 'canceling and reselecting JA did not update the URL');
  requireCondition(result.state?.lang === 'ja', 'canceling and reselecting JA did not update document language');
  requireCondition(result.state?.h1 === post.title, 'canceling and reselecting JA did not render the localized H1');
  requireCondition(result.state?.body.includes(contentMarker), 'canceling and reselecting JA did not render the localized body');
  requireCondition(result.switchMarkdownRequests.filter((requestPath) => requestPath.endsWith('-ja')).length === 2, 'canceling and reselecting JA did not make two JA Markdown requests');
});

await check('browser.legacy-persisted-ja', async () => {
  requireCondition(browser, 'No supported headless Chromium binary is installed');
  const result = await runBrowserPage(browser, '/blog/react-reconciliation', 375, 'ja');
  const persisted = JSON.parse(result.state?.storage ?? 'null');
  const post = posts.ja.find((candidate) => candidate.id === 'react-reconciliation');
  requireCondition(result.state?.pathname === '/ja/blog/react-reconciliation', 'legacy article did not transition to the persisted locale URL');
  requireCondition(result.state?.lang === 'ja', 'legacy article did not preserve the persisted document language');
  requireCondition(result.state?.h1 === post.title, 'legacy article did not render the persisted-language H1');
  const contentMarker = getBlogContentBySlug(post.slug).split('\n').find((line) => line && !line.startsWith('#'));
  requireCondition(result.state?.body.includes(contentMarker), 'legacy article did not render the persisted-language body');
  requireCondition(persisted?.state?.language === 'ja', 'legacy article overwrote the persisted language');
  requireCondition(result.markdownRequests.filter((requestPath) => requestPath.endsWith('-ja')).length === 1, 'legacy article did not make exactly one persisted-language Markdown request');
});

await check('browser.korean-hydration-console-errors', () => {
  requireCondition(browser, 'No supported headless Chromium binary is installed');
  const errors = koreanBrowserResults.flatMap((result) => result.errors);
  requireCondition(errors.length === 0, `unexpected browser console/hydration errors: ${errors.join(' | ')}`);
});

const passed = results.filter((result) => result.status === 'pass').length;
const skipped = results.filter((result) => result.status === 'skip').length;
const summaryStatus = failures || skipped ? 'fail' : 'pass';
record('summary', summaryStatus, `${passed} passed, ${skipped} skipped, ${failures} failed${skipped ? '; skipped checks are required' : ''}`);
process.exitCode = summaryStatus === 'fail' ? 1 : 0;
