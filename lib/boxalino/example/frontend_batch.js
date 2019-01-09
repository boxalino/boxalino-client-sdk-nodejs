var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../BxBatchClient", "../BxBatchRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BxBatchClient_1 = require("../BxBatchClient");
    var BxBatchRequest_1 = require("../BxBatchRequest");
    var request = require('request');
    var frontend_batch = /** @class */ (function () {
        function frontend_batch() {
            this.account = "dana_magento1_03"; // your account name
            this.password = "dana_magento1_03"; // your account password
            this.domain = "boxalino.com"; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "api.bx-cloud.com";
            this.host = "boxalino.com";
            this.profileIds = [];
        }
        frontend_batch.prototype.frontendBatch = function (account, password, isDev, host, queryText) {
            return __awaiter(this, void 0, void 0, function () {
                var bxClient, bxRequest, bxResponse, search_result, Obj_1, _loop_1, id, search_products, id, values, entity, message, e_1, exception;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.language = "de";
                            this.hitCount = 5;
                            this.choice_id = "home";
                            this.profileIds = ["27", "71"];
                            bxClient = new BxBatchClient_1.BxBatchClient(account, password, this.domain);
                            bxRequest = new BxBatchRequest_1.BxBatchRequest(this.language, this.choice_id);
                            bxRequest.setMax(this.hitCount);
                            bxRequest.setGroupBy("id");
                            bxRequest.setOffset(0);
                            bxRequest.setProfileIds(this.profileIds);
                            bxClient.setRequest(bxRequest);
                            return [4 /*yield*/, bxClient.getBatchChooseResponse()];
                        case 1:
                            bxResponse = _a.sent();
                            this.logs = Array();
                            search_result = bxResponse.getHitFieldValueForProfileIds();
                            Obj_1 = this;
                            _loop_1 = function (id) {
                                var productMaps = search_result[id];
                                var entity = "<h3>" + String(id) + "</h3>";
                                var count = 1;
                                productMaps.forEach(function (product) {
                                    for (var fieldName in product) {
                                        var fieldValues = product[fieldName];
                                        var fieldVal = fieldValues.join(',');
                                        entity = entity + fieldName + " : " + fieldVal;
                                    }
                                    entity = entity + " END OF PRODUCT " + String(count);
                                    Obj_1.logs.push(entity);
                                    count += 1;
                                });
                            };
                            for (id in search_result) {
                                _loop_1(id);
                            }
                            search_products = bxResponse.getHitIds();
                            for (id in search_products) {
                                values = search_products[id];
                                entity = "<h3>" + String(id) + "</h3>" + String(values);
                                this.logs.push(entity);
                            }
                            message = this.logs;
                            console.log(message);
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            exception = e_1;
                            if (typeof (print) === "undefined" || print !== null || print) {
                                console.log(exception);
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return frontend_batch;
    }());
    exports.frontend_batch = frontend_batch;
});
//# sourceMappingURL=frontend_batch.js.map