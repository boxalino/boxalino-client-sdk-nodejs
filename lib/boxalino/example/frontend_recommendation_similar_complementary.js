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
        define(["require", "exports", "../BxClient", "../BxRecommendationRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bxClient = require("../BxClient");
    var bxRecommendationRequest = require("../BxRecommendationRequest");
    var request = require('request');
    var frontend_recommendations_similar_complementary = /** @class */ (function () {
        function frontend_recommendations_similar_complementary() {
            this.account = "boxalino_automated_tests2"; // your account name
            this.password = "boxalino_automated_tests2"; // your account password
            this.domain = ""; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "cdn.bx-cloud.com";
            this.host = "";
        }
        frontend_recommendations_similar_complementary.prototype.frontendRecommendationsSimilarComplementary = function (account, password, isDev, host) {
            return __awaiter(this, void 0, void 0, function () {
                var _bxClient, language, itemFieldId, itemFieldIdValue, hitCount, bxRequestSimilar, bxRequestcomplementary, _a, logs, i, id, i, id, e_1, exception;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
                            language = "en";
                            this.choiceIdSimilar = "similar"; //the recommendation choice id (standard choice ids are: "similar" => similar products on product detail page, "complementary" => complementary products on product detail page, "basket" => cross-selling recommendations on basket page, "search"=>search results, "home" => home page personalized suggestions, "category" => category page suggestions, "navigation" => navigation product listing pages suggestions)
                            this.choiceIdComplementary = "complementary";
                            itemFieldId = "id";
                            itemFieldIdValue = "1940";
                            hitCount = 10;
                            bxRequestSimilar = new bxRecommendationRequest.BxRecommendationRequest(language, this.choiceIdSimilar, hitCount);
                            //indicate the product the user is looking at now (reference of what the recommendations need to be similar to)
                            bxRequestSimilar.setProductContext(itemFieldId, itemFieldIdValue);
                            //add the request
                            _bxClient.addRequest(bxRequestSimilar);
                            bxRequestcomplementary = new bxRecommendationRequest.BxRecommendationRequest(language, this.choiceIdComplementary, hitCount);
                            //indicate the product the user is looking at now (reference of what the recommendations need to be similar to)
                            bxRequestcomplementary.setProductContext(itemFieldId, itemFieldIdValue);
                            //add the request
                            _bxClient.addRequest(bxRequestcomplementary);
                            //make the query to Boxalino server and get back the response for all requests
                            _a = this;
                            return [4 /*yield*/, _bxClient.getResponse()];
                        case 2:
                            //make the query to Boxalino server and get back the response for all requests
                            _a.bxResponse = _b.sent();
                            logs = Array();
                            logs.push("recommendations of similar items:");
                            //loop on the search response hit ids and print them
                            for (i in this.bxResponse.getHitIds(this.choiceIdSimilar)) {
                                id = this.bxResponse.getHitIds(this.choiceIdSimilar)[i];
                                logs.push("" + i + ": returned id " + id + "");
                            }
                            logs.push("");
                            //retrieve the recommended responses object of the complementary request
                            logs.push("recommendations of complementary items:");
                            //loop on the search response hit ids and print them
                            for (i in this.bxResponse.getHitIds(this.choiceIdComplementary)) {
                                id = this.bxResponse.getHitIds(this.choiceIdComplementary)[i];
                                logs.push("" + i + ": returned id " + id + "");
                            }
                            if (typeof (print) === "undefined" || print !== null || print) {
                                console.log(logs.join("<br/>"));
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _b.sent();
                            exception = e_1;
                            if (typeof (print) === "undefined" || print !== null || print) {
                                console.log(exception);
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return frontend_recommendations_similar_complementary;
    }());
    exports.frontend_recommendations_similar_complementary = frontend_recommendations_similar_complementary;
});
//# sourceMappingURL=frontend_recommendation_similar_complementary.js.map