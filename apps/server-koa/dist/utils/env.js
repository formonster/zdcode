"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.initEnv = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var initEnv = function () {
    var path = '.env';
    if (process.env.NODE_ENV !== 'dev') {
        path = ".env.".concat(process.env.NODE_ENV);
    }
    if (!process.env.NODE_ENV) {
        path = '.env.prod';
    }
    // 加载 .env 环境变量
    dotenv_1["default"].config({ path: path });
};
exports.initEnv = initEnv;
