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
        define(["require", "exports", "../BxClient", "../BxSearchRequest", "../BxFacets"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bxClient = require("../BxClient");
    var bxSearchRequest = require("../BxSearchRequest");
    var BxFacets_1 = require("../BxFacets");
    var request = require('request');
    var frontend_search_facet_price = /** @class */ (function () {
        function frontend_search_facet_price() {
            this.account = "boxalino_automated_tests2"; // your account name
            this.password = "boxalino_automated_tests2"; // your account password
            this.domain = ""; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "cdn.bx-cloud.com";
            this.host = "";
        }
        frontend_search_facet_price.prototype.frontendSearchFacetPrice = function (account, password, isDev, host, queryText) {
            return __awaiter(this, void 0, void 0, function () {
                var _bxClient, language, hitCount, facetField, bxRequest, selectedValue, _a, logs, level, priceRanges, fieldValue, value, range, hitFieldValues, i, hitFields, j, hitValues, e_1, exception;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
                            language = "en";
                            hitCount = 10;
                            facetField = "products_color";
                            bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);
                            //add a facert
                            this.facets = new BxFacets_1.BxFacets();
                            selectedValue = null;
                            this.facets.addPriceRangeFacet(selectedValue);
                            bxRequest.setFacets(this.facets);
                            bxRequest.setReturnFields([this.facets.getPriceFieldName()]);
                            //add the request
                            _bxClient.addRequest(bxRequest);
                            //make the query to Boxalino server and get back the response for all requests
                            _a = this;
                            return [4 /*yield*/, _bxClient.getResponse()];
                        case 2:
                            //make the query to Boxalino server and get back the response for all requests
                            _a.bxResponse = _b.sent();
                            this.facets = this.bxResponse.getFacets();
                            logs = Array();
                            level = 0;
                            priceRanges = this.facets.getPriceRanges();
                            for (fieldValue in priceRanges) {
                                value = priceRanges[fieldValue];
                                range = "<a href=\"?bx_price=" + this.facets.getPriceValueParameterValue(value) + "\">" + this.facets.getPriceValueLabel(value) + "</a> (" + this.facets.getPriceValueCount(value) + ")";
                                if (this.facets.isPriceValueSelected(value)) {
                                    range += "<a href=\"?\">[X]</a>";
                                }
                                logs.push(range);
                            }
                            hitFieldValues = this.bxResponse.getHitFieldValues([this.facets.getPriceFieldName()]);
                            for (i in hitFieldValues) {
                                hitFields = hitFieldValues[i];
                                logs.push("<h3>" + i + "</h3>");
                                for (j in hitFields) {
                                    hitValues = hitFields[j];
                                    logs.push("Price : " + (hitValues != null && hitValues.length > 0 ? hitValues.toString() : ""));
                                }
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
        return frontend_search_facet_price;
    }());
    exports.frontend_search_facet_price = frontend_search_facet_price;
});
//# sourceMappingURL=frontend_search_facet_price.js.map