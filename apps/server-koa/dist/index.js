"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var koa_1 = __importDefault(require("koa"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var cors_1 = __importDefault(require("@koa/cors"));
var middware_1 = require("./middware");
var env_1 = require("./utils/env");
var router_1 = require("./utils/router");
(0, env_1.initEnv)();
var PORT = process.env.PORT;
var app = new koa_1["default"]();
app.use((0, cors_1["default"])({
    credentials: true
}));
// POST 请求获取 body
app.use((0, koa_bodyparser_1["default"])());
// 加载自定义中间件
(0, middware_1.loadMiddware)(app);
app.keys = ['zdcode_server'];
// 初始化路由
(0, router_1.initRouter)(app);
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 starting http://localhost:".concat(PORT));
});
