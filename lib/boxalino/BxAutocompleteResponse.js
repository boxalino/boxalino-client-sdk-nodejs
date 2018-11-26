(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "md5-typescript", "./BxChooseResponse"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var md5_typescript_1 = require("md5-typescript");
    var BxChooseResponse_1 = require("./BxChooseResponse");
    var BxAutocompleteResponse = /** @class */ (function () {
        function BxAutocompleteResponse(response, bxAutocompleteRequest) {
            if (bxAutocompleteRequest === void 0) { bxAutocompleteRequest = null; }
            this.response = response;
            this.bxAutocompleteRequest = bxAutocompleteRequest;
        }
        BxAutocompleteResponse.prototype.getResponse = function () {
            return this.response;
        };
        BxAutocompleteResponse.prototype.getPrefixSearchHash = function () {
            if (this.getResponse().prefixSearchResult.totalHitCount > 0) {
                var mdVal = md5_typescript_1.Md5.init(this.getResponse().prefixSearchResult.queryText);
                return mdVal.substring(0, 10);
            }
            else {
                return null;
            }
        };
        BxAutocompleteResponse.prototype.getTextualSuggestions = function () {
            var suggestions = Array();
            this.getResponse().hits.forEach(function (hit) {
                if (typeof (suggestions[hit.suggestion]) != "undefined" && suggestions[hit.suggestion] !== null)
                    return;
                suggestions[hit.suggestion] = hit.suggestion;
            });
            return this.reOrderSuggestions(suggestions);
        };
        BxAutocompleteResponse.prototype.suggestionIsInGroup = function (groupName, suggestion) {
            var hit = this.getTextualSuggestionHit(suggestion);
            switch (groupName) {
                case 'highlighted-beginning':
                    return hit.highlighted != "" && hit.highlighted.indexOf(this.bxAutocompleteRequest.getHighlightPre()) === 0;
                case 'highlighted-not-beginning':
                    return hit.highlighted != "" && hit.highlighted.indexOf(this.bxAutocompleteRequest.getHighlightPre()) !== 0;
                default:
                    return (hit.highlighted == "");
            }
        };
        BxAutocompleteResponse.prototype.reOrderSuggestions = function (suggestions) {
            var queryText = this.getSearchRequest().getQueryText();
            var groupNames = Array('highlighted-beginning', 'highlighted-not-beginning', 'others');
            var groupValues = Array();
            var _loop_1 = function (k) {
                var groupName = groupNames[k];
                if (groupValues[k] == null) {
                    groupValues[k] = Array();
                }
                suggestions.forEach(function (suggestion) {
                    if (this.suggestionIsInGroup(groupName, suggestion)) {
                        groupValues[k].push(suggestion);
                    }
                });
            };
            for (var k in groupNames) {
                _loop_1(k);
            }
            var final = Array();
            groupValues.forEach(function (values) {
                values.forEach(function (value) {
                    final.push(value);
                });
            });
            return final;
        };
        BxAutocompleteResponse.prototype.getTextualSuggestionHit = function (suggestion) {
            var temp = this.getResponse().hits;
            temp.forEach(function (hit) {
                if (hit.suggestion == suggestion) {
                    return hit;
                }
            });
            throw new Error("unexisting textual suggestion provided " + suggestion);
        };
        BxAutocompleteResponse.prototype.getTextualSuggestionTotalHitCount = function (suggestion) {
            var hit = this.getTextualSuggestionHit(suggestion);
            return hit.searchResult.totalHitCount;
        };
        BxAutocompleteResponse.prototype.getSearchRequest = function () {
            return this.bxAutocompleteRequest.getBxSearchRequest();
        };
        BxAutocompleteResponse.prototype.getTextualSuggestionFacets = function (suggestion) {
            var hit = this.getTextualSuggestionHit(suggestion);
            var facets = this.getSearchRequest().getFacets();
            if (facets == null || facets == "") {
                return null;
            }
            facets.setSearchResults(hit.searchResult);
            return facets;
        };
        BxAutocompleteResponse.prototype.getTextualSuggestionHighlighted = function (suggestion) {
            var hit = this.getTextualSuggestionHit(suggestion);
            if (hit.highlighted == "") {
                return suggestion;
            }
            return hit.highlighted;
        };
        BxAutocompleteResponse.prototype.getBxSearchResponse = function (textualSuggestion) {
            if (textualSuggestion === void 0) { textualSuggestion = null; }
            var suggestionHit = this.getTextualSuggestionHit(textualSuggestion);
            var searchResult = textualSuggestion == null ? this.getResponse().prefixSearchResult : suggestionHit.searchResult;
            return new BxChooseResponse_1.BxChooseResponse(searchResult, this.bxAutocompleteRequest.getBxSearchRequest());
        };
        BxAutocompleteResponse.prototype.getPropertyHits = function (field) {
            var response = this.getResponse().propertyResults;
            response.forEach(function (propertyResult) {
                if (propertyResult.name == field) {
                    return propertyResult.hits;
                }
            });
            return Array();
        };
        BxAutocompleteResponse.prototype.getPropertyHit = function (field, hitValue) {
            var proHit = this.getPropertyHits(field);
            proHit.forEach(function (hit) {
                if (hit.value == hitValue) {
                    return hit;
                }
            });
            return null;
        };
        BxAutocompleteResponse.prototype.getPropertyHitValues = function (field) {
            var hitValues = Array();
            var proHit = this.getPropertyHits(field);
            proHit.forEach(function (hit) {
                hitValues.push(hit.value);
            });
            return hitValues;
        };
        BxAutocompleteResponse.prototype.getPropertyHitValueLabel = function (field, hitValue) {
            var hit = this.getPropertyHit(field, hitValue);
            if (hit != null) {
                return hit.label;
            }
            return null;
        };
        BxAutocompleteResponse.prototype.getPropertyHitValueTotalHitCount = function (field, hitValue) {
            var hit = this.getPropertyHit(field, hitValue);
            if (hit != null) {
                return hit.totalHitCount;
            }
            return null;
        };
        return BxAutocompleteResponse;
    }());
});
//# sourceMappingURL=BxAutocompleteResponse.js.map