import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("build and Node tests stay free of tooling warnings", () => {
  const childEnv = { ...process.env };
  delete childEnv.NODE_TEST_CONTEXT;
  const config = readFileSync("next.config.ts", "utf8");
  const buildOutput = execFileSync("npm", ["run", "build"], { encoding: "utf8", env: childEnv });
  const testOutput = execFileSync(
    process.execPath,
    ["--test", "--experimental-strip-types", "src/content/blog/metadata.test.ts"],
    { encoding: "utf8", env: childEnv },
  );

  assert.match(config, /turbopack:\s*{\s*root:\s*process\.cwd\(\)/);
  assert.doesNotMatch(buildOutput, /Warning: Next\.js inferred your workspace root/);
  assert.doesNotMatch(testOutput, /MODULE_TYPELESS_PACKAGE_JSON/);
});
