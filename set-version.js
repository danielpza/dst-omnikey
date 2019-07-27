const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const file = resolve(__dirname, "./lib/modinfo.lua");
const version = require("./package.json").version;

let content = readFileSync(file, "utf8").toString();

content = content.replace("$VERSION", version);

writeFileSync(file, content);
