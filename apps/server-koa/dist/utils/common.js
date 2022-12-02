"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.dirExists = exports.sleep = exports.resError = exports.resSuccessPage = exports.resWarning = exports.resSuccess = void 0;
var fs_1 = __importDefault(require("fs"));
var resSuccess = function (data, message) {
    if (message === void 0) { message = "success"; }
    return { message: message, code: 200, data: data };
};
exports.resSuccess = resSuccess;
var resWarning = function (message, code, data) {
    if (code === void 0) { code = 201; }
    return { message: message, code: code, data: data };
};
exports.resWarning = resWarning;
var resSuccessPage = function (data, page) {
    return { message: "success", code: 200, data: data, page: page };
};
exports.resSuccessPage = resSuccessPage;
var resError = function (msg) {
    return { message: msg, code: 500, data: null };
};
exports.resError = resError;
function sleep(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
}
exports.sleep = sleep;
/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path) {
    return new Promise(function (resolve, reject) {
        fs_1["default"].stat(path, function (err, stats) {
            if (err) {
                resolve(false);
            }
            else {
                resolve(stats);
            }
        });
    });
}
/**
* 路径是否存在，不存在则创建
* @param {string} dir 路径
*/
var dirExists = function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    var isExists, mkdirStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getStat(dir)];
            case 1:
                isExists = _a.sent();
                if (!isExists) return [3 /*break*/, 2];
                return [2 /*return*/, true];
            case 2:
                mkdirStatus = void 0;
                return [4 /*yield*/, mkdir(dir)];
            case 3:
                mkdirStatus = _a.sent();
                return [2 /*return*/, mkdirStatus];
        }
    });
}); };
exports.dirExists = dirExists;
/**
  * 创建路径
  * @param {string} dir 路径
  */
function mkdir(dir) {
    return new Promise(function (resolve, reject) {
        fs_1["default"].mkdir(dir, function (err) {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
