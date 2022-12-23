#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");
var import_template = __toESM(require("@zdcode/template"));

// package.json
var package_default = {
  name: "@zdcode/cli",
  version: "1.0.0",
  description: "",
  main: "dist/index.mjs",
  types: "dist/index.d.ts",
  scripts: {
    dev: "tsup --watch",
    prepublish: "pnpm run build",
    build: "tsup"
  },
  keywords: [],
  author: "",
  license: "ISC",
  bin: {
    zd: "./dist/index.mjs"
  },
  dependencies: {
    "@zdcode/template": "workspace:^1.0.0",
    "@zdcode/tsconfig": "workspace:^0.0.0",
    commander: "^9.4.1",
    lodash: "^4.17.21",
    tsconfig: "^7.0.0",
    tsup: "^6.3.0"
  },
  devDependencies: {
    "@types/lodash": "^4.14.191",
    "@types/node": "^18.11.12",
    typescript: "^4.9.4"
  }
};

// src/index.ts
var program = new import_commander.Command();
(0, import_template.default)(program);
program.version(
  package_default.version,
  "-v, --version",
  "output the current version"
);
program.parse(process.argv);
