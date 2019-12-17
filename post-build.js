const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const { version, description, homepage } = require("./package.json");

function updateFile(file, updater) {
  writeFileSync(file, updater(readFileSync(file, "utf8").toString()));
}

updateFile(resolve(__dirname, "./lib/modinfo.lua"), content =>
  content
    .replace("$VERSION", version)
    .replace("$DESCRIPTION", description)
    .replace("$HOMEPAGE", homepage)
);

updateFile(
  resolve(__dirname, "./lib/modmain.lua"),
  content =>
    "local require = GLOBAL.require;\n" +
    "local setmetatable = GLOBAL.setmetatable;\n" +
    "local unpack = GLOBAL.unpack;\n" +
    content.replace(new RegExp("scripts.omnikey.", "g"), "omnikey/")
);

["cache", "utils", "values"].forEach(name => {
  updateFile(resolve(__dirname, `./lib/scripts/omnikey/${name}.lua`), content =>
    content
      .replace(new RegExp("GLOBAL.", "g"), "")
      .replace(new RegExp("scripts.omnikey.", "g"), "omnikey/")
  );
});
