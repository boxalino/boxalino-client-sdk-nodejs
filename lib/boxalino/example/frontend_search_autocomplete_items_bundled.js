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
    var frontend_search_autocomplete_items_bundled = /** @class */ (function () {
        function frontend_search_autocomplete_items_bundled() {
            this.account = "boxalino_automated_tests2"; // your account name
            this.password = "boxalino_automated_tests2"; // your account password
            this.domain = ""; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "cdn.bx-cloud.com";
            this.host = "";
        }
        frontend_search_autocomplete_items_bundled.prototype.frontend_search_autocomplete_items_bundled = function (account, password, isDev, host, queryTexts) {
            return __awaiter(this, void 0, void 0, function () {
                var _bxClient, language_1, textualSuggestionsHitCount_1, fieldNames, bxRequests, thisObj, _a, i, e_1, exception;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
                            language_1 = "en";
                            textualSuggestionsHitCount_1 = 10;
                            fieldNames = ['title'];
                            bxRequests = [];
                            thisObj = this;
                            queryTexts.forEach(function (queryText) {
                                //create search request
                                var bxRequest = new bxAutoCompleteRequest.BxAutocompleteRequest(language_1, queryText, textualSuggestionsHitCount_1);
                                //N.B.: in case you would want to set a filter on a request and not another, you can simply do it by getting the searchchoicerequest with: $bxRequest->getBxSearchRequest() and adding a filter
                                //set the fields to be returned for each item in the response
                                bxRequest.getBxSearchRequest().setReturnFields(fieldNames);
                                bxRequests.push(bxRequest);
                            });
                            //set the request
                            _bxClient.setAutocompleteRequests(bxRequests);
                            //make the query to Boxalino server and get back the response for all requests
                            _a = this;
                            return [4 /*yield*/, _bxClient.getAutocompleteResponses()];
                        case 2:
                            //make the query to Boxalino server and get back the response for all requests
                            _a.bxResponses = _b.sent();
                            i = -1;
                            //this.logs: string[] = Array();
                            this.bxResponses.forEach(function (bxAutocompleteResponse) {
                                //loop on the search response hit ids and print them
                                var queryText = queryTexts[++i];
                                thisObj.logs.push("<h2>textual suggestions for " + queryText + ":</h2>");
                                //-------1   bxAutocompleteResponse.getTextualSuggestions().forEach( function (suggestion:any) {
                                for (var suggestion in bxAutocompleteResponse.getTextualSuggestions()) {
                                    thisObj.logs.push("<div style=\"border:1px solid; padding:10px; margin:10px\">");
                                    thisObj.logs.push("<h3>" + suggestion + "</b></h3>");
                                    thisObj.logs.push("item suggestions for suggestion " + suggestion + ":");
                                    //loop on the search response hit ids and print them
                                    var hitFieldValues = bxAutocompleteResponse.getBxSearchResponse(suggestion).getHitFieldValues(fieldNames);
                                    for (var fieldValueObj in hitFieldValues) {
                                        //fieldValueMap[fieldName].toString()
                                        thisObj.logs.push("<div>" + fieldValueObj);
                                        for (var fieldName in hitFieldValues[fieldValueObj]) {
                                            var dynamicObj = hitFieldValues[fieldValueObj][fieldName];
                                            thisObj.logs.push(" - " + fieldName + ": " + dynamicObj.join(','));
                                        }
                                        thisObj.logs.push("</div>");
                                    }
                                    thisObj.logs.push("</div>");
                                }
                                //-----------------foreach1   });
                                thisObj.logs.push("<h2>global item suggestions for " + queryText + ":</h2>");
                                //loop on the search response hit ids and print them
                                var hitFieldValues1 = bxAutocompleteResponse.getBxSearchResponse().getHitFieldValues(fieldNames);
                                hitFieldValues1.forEach(function (fieldValueMap, id) {
                                    thisObj.logs.push("<div>" + id);
                                    for (var fieldName in fieldValueMap) {
                                        // thisObj.logs.push(" - "+fieldName+": " + fieldValues.join(','));
                                        thisObj.logs.push(" - " + fieldName + ": " + fieldValueMap[fieldName].toString());
                                    }
                                    thisObj.logs.push("</div>");
                                });
                            });
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
        return frontend_search_autocomplete_items_bundled;
    }());
    exports.frontend_search_autocomplete_items_bundled = frontend_search_autocomplete_items_bundled;
});
//# sourceMappingURL=frontend_search_autocomplete_items_bundled.js.map