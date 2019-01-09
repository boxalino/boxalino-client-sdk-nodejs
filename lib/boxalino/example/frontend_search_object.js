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
        define(["require", "exports", "../BxClient", "../BxFacets", "../BxSearchRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BxClient_1 = require("../BxClient");
    var BxFacets_1 = require("../BxFacets");
    var BxSearchRequest_1 = require("../BxSearchRequest");
    var request = require('request');
    var frontend_search_object = /** @class */ (function () {
        function frontend_search_object() {
            this.account = "boxalino_automated_tests2"; // your account name
            this.password = "boxalino_automated_tests2"; // your account password
            this.domain = ""; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "cdn.bx-cloud.com";
            this.host = "mooris.ch";
            this.profileIds = Array();
        }
        frontend_search_object.prototype.frontendSearchObject = function (account, password, isDev, host) {
            return __awaiter(this, void 0, void 0, function () {
                var bxClient, bxRequest, facetsSet, _a, facets, collection, renderedCollection, message, e_1, exception;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            this.account = account;
                            this.password = password;
                            this.host = host;
                            this.language = "en";
                            this.hitCount = 10;
                            this.choice_id = "search";
                            this.queryText = "";
                            this.selectedValue = null;
                            bxClient = new BxClient_1.BxClient(account, password, this.domain);
                            bxRequest = new BxSearchRequest_1.BxSearchRequest(this.language, this.queryText, this.hitCount, this.choice_id);
                            bxRequest.setOffset(0);
                            facetsSet = new BxFacets_1.BxFacets();
                            facetsSet.addPriceRangeFacet(this.selectedValue);
                            facetsSet.addFacet("products_color", this.selectedValue);
                            bxRequest.setFacets(facetsSet);
                            bxRequest.setGroupFacets(true);
                            bxClient.addRequest(bxRequest);
                            _a = this;
                            return [4 /*yield*/, bxClient.getResponse()];
                        case 1:
                            _a.bxResponse = _b.sent();
                            facets = this.bxResponse.getFacets();
                            collection = facets.getFacetsAsObjectsCollection("en");
                            renderedCollection = this.render_facets_from_collection(collection, facets);
                            this.logs.push(renderedCollection);
                            message = this.logs;
                            console.log(message);
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _b.sent();
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
        frontend_search_object.prototype.render_facets_from_collection = function (collection, facets) {
            var logs = [];
            var icon = '';
            for (var field in collection) {
                var facetObject = collection[field];
                logs.push("----------------------" + String(field) + " - " + String(facetObject.label) + "---------------------------");
                if (facetObject.hidden || facetObject.optionValues == null) {
                    logs.push("facet is hidden or has no output");
                    return logs;
                }
                if (facetObject.icon == null) {
                    var icon_1 = '';
                }
                else {
                    var icon_2 = "<i class=\"" + facetObject.icon + "\"></i>";
                }
                logs.push("<div class=\"container\">");
                logs.push("<div class=\"header\">" + String(icon) + " <span>" + String(facetObject.label) + "</span></div>");
                logs.push("<div class=\"content\">");
                var showedMoreLink = false;
                var showCounter = facetObject.showCounter;
                if (facetObject.optionValues != null) {
                    for (var permalink in facetObject.optionValues) {
                        var optionValue = facetObject.optionValues[permalink];
                        if (facetObject.type == "ranged") {
                            facets.getPriceRanges().forEach(function (fieldValue) {
                                var range = "<a href=\"?bx_price=" + facets.getPriceValueParameterValue(fieldValue) + "\">" + facets.getPriceValueLabel(fieldValue) + "</a> (" + String(facets.getPriceValueCount(fieldValue)) + ")";
                                if (facets.isPriceValueSelected(fieldValue)) {
                                    range = range + "<a href=\"?\">[X]</a>";
                                }
                                logs.push(range);
                            });
                        }
                        else {
                            var facetOption = optionValue;
                            var postfix = "";
                            if (showCounter) {
                                var hitcount = facetOption.hitCount;
                                postfix = " (" + String(hitcount) + ")";
                            }
                            if (facetOption.selected) {
                                postfix = String(postfix) + "<a href=\"?\">[X]</a>";
                            }
                            if (facetOption.icon == null) {
                                facetOption.icon = "<M>";
                            }
                            if (!showedMoreLink && facetOption.hidden) {
                                showedMoreLink = true;
                                logs.push("<li class=\"show_more_values\">more values</li>");
                            }
                            logs.push("<li class=\"additional_values_\"><a href=\"?bx_" + field + "=" + String(facetOption.stringValue) + "\">" + String(facetOption.icon) + facetOption.label + "</a>" + postfix + "</li>");
                        }
                    }
                }
                logs.push("</ul></div></div>");
                logs.join("<br/>");
            }
            return logs;
        };
        return frontend_search_object;
    }());
    exports.frontend_search_object = frontend_search_object;
});
//# sourceMappingURL=frontend_search_object.js.map