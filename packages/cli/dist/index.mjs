#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import temp from "@zdcode/template";

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
var program = new Command();
temp(program);
program.version(
  package_default.version,
  "-v, --version",
  "output the current version"
);
program.parse(process.argv);
