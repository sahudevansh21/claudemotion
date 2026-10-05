#!/usr/bin/env node
/**
 * Scaffold a new composition from src/compositions/_Template.
 *
 *   npm run new -- ProductLaunch
 *
 * Creates src/compositions/ProductLaunch/ProductLaunch.tsx and registers a
 * <Composition id="ProductLaunch"> in src/Root.tsx.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const name = process.argv[2];

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error(
    "Usage: npm run new -- <PascalCaseName>   (e.g. npm run new -- ProductLaunch)",
  );
  process.exit(1);
}

const dir = join(root, "src", "compositions", name);
const file = join(dir, `${name}.tsx`);
if (existsSync(dir)) {
  console.error(`src/compositions/${name} already exists.`);
  process.exit(1);
}

const constName = `${name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase()}_SECONDS`;
const template = readFileSync(
  join(root, "src", "compositions", "_Template", "Template.tsx"),
  "utf8",
);
const source = template
  .replace(/\/\*\*\n \* Starter for new compositions[\s\S]*?\*\/\n/, "")
  .replaceAll("TEMPLATE_SECONDS", constName)
  .replaceAll("Template", name);

mkdirSync(dir, { recursive: true });
writeFileSync(file, source);

const rootFile = join(root, "src", "Root.tsx");
const IMPORT_MARK = "// @new-composition-imports";
const REG_MARK = "{/* @new-composition-registrations";
let rootSrc = readFileSync(rootFile, "utf8");
if (!rootSrc.includes(IMPORT_MARK) || !rootSrc.includes(REG_MARK)) {
  console.error(
    "Created the file, but could not find the marker comments in src/Root.tsx — register it manually.",
  );
  process.exit(1);
}
rootSrc = rootSrc.replace(
  IMPORT_MARK,
  `import { ${name}, ${constName} } from "./compositions/${name}/${name}";\n${IMPORT_MARK}`,
);
rootSrc = rootSrc.replace(
  REG_MARK,
  `<Composition
        id="${name}"
        component={${name}}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={seconds(${constName}, VIDEO.fps)}
      />

      ${REG_MARK}`,
);
writeFileSync(rootFile, rootSrc);

console.log(`Created src/compositions/${name}/${name}.tsx`);
console.log(`Registered <Composition id="${name}"> in src/Root.tsx`);
console.log(`Preview:  npm run dev   (then pick "${name}" in the sidebar)`);
console.log(`Render:   npx remotion render ${name} out/${name}.mp4`);
