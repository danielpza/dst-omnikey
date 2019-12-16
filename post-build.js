const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const modinfo = resolve(__dirname, "./lib/modinfo.lua");
const { version, description, homepage } = require("./package.json");

writeFileSync(
  modinfo,
  readFileSync(modinfo, "utf8")
    .toString()
    .replace("$VERSION", version)
    .replace("$DESCRIPTION", description)
    .replace("$HOMEPAGE", homepage)
);
