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
        define(["require", "exports", "../BxClient", "../BxAutocompleteRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bxClient = require("../BxClient");
    var bxAutoCompleteRequest = require("../BxAutocompleteRequest");
    var request = require('request');
    var frontend_search_autocomplete_items = /** @class */ (function () {
        function frontend_search_autocomplete_items() {
            this.account = "boxalino_automated_tests2"; // your account name
            this.password = "boxalino_automated_tests2"; // your account password
            this.domain = ""; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "cdn.bx-cloud.com";
            this.host = "";
        }
        frontend_search_autocomplete_items.prototype.frontendSearchAutocompleteItems = function (account, password, isDev, host, queryText) {
            return __awaiter(this, void 0, void 0, function () {
                var _bxClient, language, textualSuggestionsHitCount, fieldNames, thisObj, bxRequest, _a, suggestion, hitFieldObj, hitFieldValues, id, fieldValueMap, hitFieldObj1, hitFieldValues1, _loop_1, id, e_1, exception;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
                            language = "en";
                            textualSuggestionsHitCount = 10;
                            fieldNames = ['title'];
                            thisObj = this;
                            bxRequest = new bxAutoCompleteRequest.BxAutocompleteRequest(language, queryText, textualSuggestionsHitCount);
                            //set the fields to be returned for each item in the response
                            bxRequest.getBxSearchRequest().setReturnFields(fieldNames);
                            //set the request
                            _bxClient.setAutocompleteRequest(Array(bxRequest));
                            //make the query to Boxalino server and get back the response for all requests
                            _a = this;
                            return [4 /*yield*/, _bxClient.getAutocompleteResponse()];
                        case 2:
                            //make the query to Boxalino server and get back the response for all requests
                            _a.bxResponse = _b.sent();
                            //loop on the search response hit ids and print them
                            this.logs.push("textual suggestions for " + queryText + ":<br>");
                            for (suggestion in this.bxResponse.getTextualSuggestions()) {
                                thisObj.logs.push("<div style=\"border:1px solid; padding:10px; margin:10px\">");
                                thisObj.logs.push("<h3>" + suggestion + "</b></h3>");
                                thisObj.logs.push("item suggestions for suggestion " + suggestion + ":<br>");
                                hitFieldObj = this.bxResponse.getBxSearchResponse(suggestion);
                                hitFieldValues = hitFieldObj.getHitFieldValues(fieldNames);
                                for (id in hitFieldValues) {
                                    fieldValueMap = hitFieldValues[id];
                                    thisObj.logs.push("<div>" + id);
                                    fieldValueMap.forEach(function (fieldName, fieldValues) {
                                        thisObj.logs.push(" - " + fieldName + ": " + fieldValues.join(','));
                                    });
                                    thisObj.logs.push("</div>");
                                }
                                thisObj.logs.push("</div>");
                            }
                            //////////////////////
                            thisObj.logs.push("global item suggestions for " + queryText + ":<br>");
                            hitFieldObj1 = this.bxResponse.getBxSearchResponse();
                            hitFieldValues1 = hitFieldObj1.getHitFieldValues(fieldNames);
                            _loop_1 = function (id) {
                                var item = id;
                                var fieldValueMap = hitFieldValues[id];
                                thisObj.logs.push("<div>" + id);
                                fieldValueMap.forEach(function (fieldName, fieldValues) {
                                    item = item + " - " + fieldName + ": " + fieldValues.join(',') + "<br>";
                                });
                                thisObj.logs.push(item);
                            };
                            for (id in hitFieldValues1) {
                                _loop_1(id);
                            }
                            if (typeof (print) === "undefined" || print !== null || print) {
                                console.log(this.logs.join("<br/>"));
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
        return frontend_search_autocomplete_items;
    }());
    exports.frontend_search_autocomplete_items = frontend_search_autocomplete_items;
});
//# sourceMappingURL=frontend_search_autocomplete_items.js.map