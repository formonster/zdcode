"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.initRouter = void 0;
var path_1 = __importDefault(require("path"));
var awilix_1 = require("awilix");
var awilix_koa_1 = require("awilix-koa");
var IS_BUILD_ENV = process.env.IS_BUILD_ENV === 'true';
var root = path_1["default"].join(__dirname, '../');
var initRouter = function (app) {
    // 创建一个基础容器，负责装载服务
    var container = (0, awilix_1.createContainer)();
    // 加载 Service 模块
    container.loadModules(IS_BUILD_ENV ? ["".concat(root, "/modules/**/*Service.js")] : ["".concat(root, "/modules/**/*Service.ts"), "".concat(root, "/modules/**/*Service.tsx")], {
        // 定义命名方式：驼峰形式
        formatName: 'camelCase',
        resolverOptions: {
            // 每次调用都创建新的实例
            lifetime: awilix_1.Lifetime.SCOPED
        }
    });
    // 注入 container
    app.use((0, awilix_koa_1.scopePerRequest)(container));
    // 加载路由
    app.use(IS_BUILD_ENV
        ? (0, awilix_koa_1.loadControllers)("".concat(root, "/modules/**/*Controller.js"))
        : (0, awilix_koa_1.loadControllers)("".concat(root, "/modules/**/*Controller.ts"), "".concat(root, "/modules/**/*Controller.tsx")));
};
exports.initRouter = initRouter;
