"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var jsx_runtime_1 = require("react/jsx-runtime");
var server_1 = require("react-dom/server");
var common_1 = require("../../utils/common");
var IndexService = /** @class */ (function () {
    function IndexService() {
    }
    IndexService.prototype.check = function () {
        return (0, common_1.resSuccess)(true);
    };
    IndexService.prototype.hello = function () {
        return (0, server_1.renderToString)((0, jsx_runtime_1.jsx)("div", __assign({ style: {
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                height: '100vh',
                width: '100vw',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000'
            } }, { children: (0, jsx_runtime_1.jsx)("h1", __assign({ style: { color: '#fff' } }, { children: "Hello KoaServer!" })) })));
    };
    return IndexService;
}());
exports["default"] = IndexService;
