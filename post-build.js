const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const { version, description, homepage } = require("./package.json");
const {
  compilerOptions: { outDir },
} = require("./tsconfig.json");

// const readme = readFileSync(resolve(__dirname, "README.md"), "utf8").toString();

function updateFile(file, updater) {
  writeFileSync(file, updater(readFileSync(file, "utf8").toString()));
}

updateFile(
  resolve(__dirname, outDir, "modinfo.lua"),
  (content) =>
    content
      .replace("$VERSION", version)
      .replace("$DESCRIPTION", description)
      .replace("$HOMEPAGE", homepage)
  // .replace("$README", readme.replace(/\n/g, "\\n"))
);

updateFile(
  resolve(__dirname, outDir, "modmain.lua"),
  (content) =>
    "local require = GLOBAL.require;\n" +
    "local setmetatable = GLOBAL.setmetatable;\n" +
    "local unpack = GLOBAL.unpack;\n" +
    content.replace(new RegExp("scripts.omnikey.", "g"), "omnikey/")
);

["widget", "cache", "utils", "values"].forEach((name) => {
  updateFile(
    resolve(__dirname, outDir, `scripts/omnikey/${name}.lua`),
    (content) =>
      content
        .replace(new RegExp("GLOBAL.", "g"), "")
        .replace(new RegExp("scripts.omnikey.", "g"), "omnikey/")
  );
});
