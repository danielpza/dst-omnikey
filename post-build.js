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

updateFile(resolve(__dirname, "./lib/scripts/omnikey/cache.lua"), content =>
  content.replace(new RegExp("GLOBAL.", "g"), "")
);

updateFile(resolve(__dirname, "./lib/scripts/omnikey/values.lua"), content =>
  content.replace(new RegExp("GLOBAL.", "g"), "")
);
