const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const file = resolve(__dirname, "./lib/modinfo.lua");
const { version, description, homepage } = require("./package.json");

let content = readFileSync(file, "utf8").toString();

content = content
  .replace("$VERSION", version)
  .replace("$DESCRIPTION", description)
  .replace("$HOMEPAGE", homepage);

writeFileSync(file, content);
