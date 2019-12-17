const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const modinfo = resolve(__dirname, "./lib/modinfo.lua");
const modmain = resolve(__dirname, "./lib/modmain.lua");
const { version, description, homepage } = require("./package.json");

writeFileSync(
  modinfo,
  readFileSync(modinfo, "utf8")
    .toString()
    .replace("$VERSION", version)
    .replace("$DESCRIPTION", description)
    .replace("$HOMEPAGE", homepage)
);

writeFileSync(
  modmain,
  "local setmetatable = GLOBAL.setmetatable;\n" +
    "local unpack = GLOBAL.unpack;\n" +
    readFileSync(modmain, "utf8").toString()
);
