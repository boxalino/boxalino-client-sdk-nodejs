(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BxSearchRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var thrift_types = require('./bxthrift/p13n_types');
    var BxSearchRequest_1 = require("./BxSearchRequest");
    var BxAutocompleteRequest = /** @class */ (function () {
        function BxAutocompleteRequest(language, queryText, textualSuggestionsHitCount, productSuggestionHitCount, autocompleteChoiceId, searchChoiceId, highlight, highlightPre, highlightPost) {
            if (productSuggestionHitCount === void 0) { productSuggestionHitCount = 5; }
            if (autocompleteChoiceId === void 0) { autocompleteChoiceId = 'autocomplete'; }
            if (searchChoiceId === void 0) { searchChoiceId = 'search'; }
            if (highlight === void 0) { highlight = true; }
            if (highlightPre === void 0) { highlightPre = '<em>'; }
            if (highlightPost === void 0) { highlightPost = '</em>'; }
            this.highlight = true;
            this.propertyQueries = Array();
            this.indexId = null;
            language = language;
            queryText = queryText;
            textualSuggestionsHitCount = textualSuggestionsHitCount;
            highlight = highlight;
            highlightPre = highlightPre;
            highlightPost = highlightPost;
            if (autocompleteChoiceId == null || autocompleteChoiceId == "") {
                autocompleteChoiceId = 'autocomplete';
            }
            var choiceId = autocompleteChoiceId;
            this.bxSearchRequest = new BxSearchRequest_1.BxSearchRequest(language, queryText, productSuggestionHitCount, searchChoiceId);
        }
        BxAutocompleteRequest.prototype.getBxSearchRequest = function () {
            return this.bxSearchRequest;
        };
        BxAutocompleteRequest.prototype.setBxSearchRequest = function (bxSearchRequest) {
            bxSearchRequest = bxSearchRequest;
        };
        BxAutocompleteRequest.prototype.getLanguage = function () {
            return this.language;
        };
        BxAutocompleteRequest.prototype.setLanguage = function (language) {
            language = language;
        };
        BxAutocompleteRequest.prototype.getQuerytext = function () {
            return this.queryText;
        };
        BxAutocompleteRequest.prototype.setQuerytext = function (queryText) {
            queryText = queryText;
        };
        BxAutocompleteRequest.prototype.getChoiceId = function () {
            return this.choiceId;
        };
        BxAutocompleteRequest.prototype.setChoiceId = function (choiceId) {
            choiceId = choiceId;
        };
        BxAutocompleteRequest.prototype.getTextualSuggestionHitCount = function () {
            return this.textualSuggestionsHitCount;
        };
        BxAutocompleteRequest.prototype.setTextualSuggestionHitCount = function (textualSuggestionsHitCount) {
            textualSuggestionsHitCount = textualSuggestionsHitCount;
        };
        BxAutocompleteRequest.prototype.getIndexId = function () {
            return this.indexId;
        };
        BxAutocompleteRequest.prototype.setIndexId = function (indexId) {
            indexId = indexId;
        };
        BxAutocompleteRequest.prototype.setDefaultIndexId = function (indexId) {
            if (indexId == null) {
                this.setIndexId(indexId);
            }
            this.bxSearchRequest.setDefaultIndexId(indexId);
        };
        BxAutocompleteRequest.prototype.getHighlight = function () {
            return this.highlight;
        };
        BxAutocompleteRequest.prototype.getHighlightPre = function () {
            return this.highlightPre;
        };
        BxAutocompleteRequest.prototype.getHighlightPost = function () {
            return this.highlightPost;
        };
        BxAutocompleteRequest.prototype.getAutocompleteQuery = function () {
            var autocompleteQuery = new thrift_types.AutocompleteQuery();
            autocompleteQuery.indexId = this.getIndexId();
            autocompleteQuery.language = this.language;
            autocompleteQuery.queryText = this.queryText;
            autocompleteQuery.suggestionsHitCount = this.textualSuggestionsHitCount;
            autocompleteQuery.highlight = this.highlight;
            autocompleteQuery.highlightPre = this.highlightPre;
            autocompleteQuery.highlightPost = this.highlightPost;
            return autocompleteQuery;
        };
        BxAutocompleteRequest.prototype.addPropertyQuery = function (field, hitCount, evaluateTotal) {
            if (evaluateTotal === void 0) { evaluateTotal = false; }
            var propertyQuery = new thrift_types.PropertyQuery();
            propertyQuery.name = field;
            propertyQuery.hitCount = hitCount;
            propertyQuery.evaluateTotal = evaluateTotal;
            this.propertyQueries.push(propertyQuery);
        };
        BxAutocompleteRequest.prototype.resetPropertyQueries = function () {
            this.propertyQueries = Array();
        };
        BxAutocompleteRequest.prototype.getAutocompleteThriftRequest = function (profileid, thriftUserRecord) {
            var autocompleteRequest = new thrift_types.AutocompleteQuery();
            autocompleteRequest.userRecord = thriftUserRecord;
            autocompleteRequest.profileId = profileid;
            autocompleteRequest.choiceId = this.choiceId;
            autocompleteRequest.searchQuery = this.bxSearchRequest.getSimpleSearchQuery();
            autocompleteRequest.searchChoiceId = this.bxSearchRequest.getChoiceId();
            autocompleteRequest.autocompleteQuery = this.getAutocompleteQuery();
            if (this.propertyQueries.length > 0) {
                autocompleteRequest.propertyQueries = this.propertyQueries;
            }
            return autocompleteRequest;
        };
        return BxAutocompleteRequest;
    }());
    exports.BxAutocompleteRequest = BxAutocompleteRequest;
});
//# sourceMappingURL=BxAutocompleteRequest.js.map