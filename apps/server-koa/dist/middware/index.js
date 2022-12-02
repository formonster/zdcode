"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.loadMiddware = void 0;
var error_1 = __importDefault(require("./error"));
var log_1 = __importDefault(require("./log"));
function loadMiddware(app) {
    app.use(log_1["default"]);
    app.use(error_1["default"]);
}
exports.loadMiddware = loadMiddware;
