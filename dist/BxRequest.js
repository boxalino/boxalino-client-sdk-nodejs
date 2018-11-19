(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BxSortFields"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bxSortFields = require("./BxSortFields");
    var thrift_types = require('./bxthrift/p13n_types');
    var BxRequest = /** @class */ (function () {
        function BxRequest(language, choiceId, max, min) {
            if (max === void 0) { max = 10; }
            if (min === void 0) { min = 0; }
            this.language = null;
            this.groupBy = null;
            this.choiceId = null;
            this.min = null;
            this.max = null;
            this.withRelaxation = null;
            this.indexId = "";
            this.requestMap = null;
            this.returnFields = Array();
            this.offset = 0;
            this.queryText = "";
            this.bxFacets = null;
            this.bxSortFields = null;
            this.bxFilters = Array();
            this.orFilters = false;
            this.hitsGroupsAsHits = null;
            this.groupFacets = null;
            this.requestContextParameters = Array();
            this.contextItems = Array();
            if (choiceId == '') {
                throw new Error('BxRequest created with null choiceId');
            }
            this.language = language;
            this.choiceId = choiceId;
            this.min = parseFloat(min);
            this.max = parseFloat(max);
            if (this.max == 0) {
                this.max = 1;
            }
            this.withRelaxation = choiceId == 'search';
        }
        BxRequest.prototype.getWithRelaxation = function () {
            return this.withRelaxation;
        };
        BxRequest.prototype.setWithRelaxation = function (withRelaxation) {
            this.withRelaxation = withRelaxation;
        };
        BxRequest.prototype.getReturnFields = function () {
            return this.returnFields;
        };
        BxRequest.prototype.setReturnFields = function (returnFields) {
            this.returnFields = returnFields;
        };
        BxRequest.prototype.getOffset = function () {
            return this.offset;
        };
        BxRequest.prototype.setOffset = function (offset) {
            this.offset = offset;
        };
        BxRequest.prototype.getQuerytext = function () {
            return this.queryText;
        };
        BxRequest.prototype.setQuerytext = function (queryText) {
            this.queryText = queryText;
        };
        BxRequest.prototype.getFacets = function () {
            return this.bxFacets;
        };
        BxRequest.prototype.setFacets = function (bxFacets) {
            this.bxFacets = bxFacets;
        };
        BxRequest.prototype.getSortFields = function () {
            return this.bxSortFields;
        };
        BxRequest.prototype.setSortFields = function (bxSortFields) {
            this.bxSortFields = bxSortFields;
        };
        BxRequest.prototype.getFilters = function () {
            var filters = this.bxFilters;
            if (this.getFacets()) {
                var tempFilters = this.getFacets().getFilters();
                tempFilters.forEach(function (filter) {
                    filters.push(filter);
                });
            }
            return this.bxFilters;
        };
        BxRequest.prototype.setFilters = function (bxFilters) {
            this.bxFilters = bxFilters;
        };
        BxRequest.prototype.addFilter = function (bxFilter) {
            this.bxFilters[bxFilter.getFieldName()] = bxFilter;
        };
        BxRequest.prototype.getOrFilters = function () {
            return this.orFilters;
        };
        BxRequest.prototype.setOrFilters = function (orFilters) {
            this.orFilters = orFilters;
        };
        BxRequest.prototype.addSortField = function (field, reverse) {
            if (reverse === void 0) { reverse = false; }
            if (this.bxSortFields == null) {
                this.bxSortFields = new bxSortFields.BxSortFields();
            }
            this.bxSortFields.push(field, reverse);
        };
        BxRequest.prototype.getChoiceId = function () {
            return this.choiceId;
        };
        BxRequest.prototype.setChoiceId = function (choiceId) {
            this.choiceId = choiceId;
        };
        BxRequest.prototype.getMax = function () {
            return this.max;
        };
        BxRequest.prototype.setMax = function (max) {
            this.max = max;
        };
        BxRequest.prototype.getMin = function () {
            return this.min;
        };
        BxRequest.prototype.setMin = function (min) {
            this.min = min;
        };
        BxRequest.prototype.getIndexId = function () {
            return this.indexId;
        };
        BxRequest.prototype.setIndexId = function (indexId) {
            this.indexId = indexId;
            var that = this;
            this.contextItems.forEach(function (v, k) {
                var contextItem = that.contextItems[k];
                if (contextItem.indexId == "" || contextItem.indexId == null) {
                    that.contextItems[k].indexId = indexId;
                }
            });
        };
        BxRequest.prototype.setDefaultIndexId = function (indexId) {
            if (this.indexId == "") {
                this.setIndexId(indexId);
            }
        };
        BxRequest.prototype.setDefaultRequestMap = function (requestMap) {
            if (this.requestMap == null) {
                this.requestMap = requestMap;
            }
        };
        BxRequest.prototype.getLanguage = function () {
            return this.language;
        };
        BxRequest.prototype.setLanguage = function (language) {
            this.language = language;
        };
        BxRequest.prototype.getGroupBy = function () {
            return this.groupBy;
        };
        BxRequest.prototype.setGroupBy = function (groupBy) {
            this.groupBy = groupBy;
        };
        BxRequest.prototype.setHitsGroupsAsHits = function (groupsAsHits) {
            this.hitsGroupsAsHits = groupsAsHits;
        };
        BxRequest.prototype.setGroupFacets = function (groupFacets) {
            this.groupFacets = groupFacets;
        };
        BxRequest.prototype.getSimpleSearchQuery = function () {
            var searchQuery = new thrift_types.SimpleSearchQuery();
            searchQuery.indexId = this.getIndexId();
            searchQuery.language = this.getLanguage();
            searchQuery.returnFields = this.getReturnFields();
            searchQuery.offset = this.getOffset();
            searchQuery.hitCount = this.getMax();
            searchQuery.queryText = this.getQuerytext();
            searchQuery.groupFacets = (this.groupFacets === null) ? false : this.groupFacets;
            searchQuery.groupBy = this.groupBy;
            if (this.hitsGroupsAsHits !== null) {
                searchQuery.hitsGroupsAsHits = this.hitsGroupsAsHits;
            }
            if (this.getFilters().length > 0) {
                searchQuery.filters = Array();
                this.getFilters().forEach(function (filter) {
                    searchQuery.filters.push(filter.getThriftFilter());
                });
            }
            searchQuery.orFilters = this.getOrFilters();
            if (this.getFacets()) {
                searchQuery.facetRequests = this.getFacets().getThriftFacets();
            }
            if (this.getSortFields()) {
                searchQuery.sortFields = this.getSortFields().getThriftSortFields();
            }
            return searchQuery;
        };
        BxRequest.prototype.setProductContext = function (fieldName, contextItemId, role, relatedProducts, relatedProductField) {
            if (role === void 0) { role = 'mainProduct'; }
            if (relatedProducts === void 0) { relatedProducts = Array(); }
            if (relatedProductField === void 0) { relatedProductField = 'id'; }
            var contextItem = new thrift_types.ContextItem();
            contextItem.indexId = this.getIndexId();
            contextItem.fieldName = fieldName;
            contextItem.contextItemId = contextItemId;
            contextItem.role = role;
            this.contextItems.push(contextItem);
            this.addRelatedProducts(relatedProducts, relatedProductField);
        };
        BxRequest.prototype.setBasketProductWithPrices = function (fieldName, basketContent, role, subRole, relatedProducts, relatedProductField) {
            if (role === void 0) { role = 'mainProduct'; }
            if (subRole === void 0) { subRole = 'subProduct'; }
            if (relatedProducts === void 0) { relatedProducts = Array(); }
            if (relatedProductField === void 0) { relatedProductField = 'id'; }
            if (basketContent !== false && basketContent.count) {
                // Sort basket content by price
                basketContent.sort(function (a, b) {
                    if (a['price'] > b['price']) {
                        return -1;
                    }
                    else if (b['price'] > a['price']) {
                        return 1;
                    }
                    return 0;
                });
                var basketItem = basketContent.shift();
                var contextItem_1 = new thrift_types.ContextItem();
                contextItem_1.indexId = this.getIndexId();
                contextItem_1.fieldName = fieldName;
                contextItem_1.contextItemId = basketItem['id'];
                contextItem_1.role = role;
                this.contextItems.push(contextItem_1);
                basketContent.forEach(function (basketItem) {
                    contextItem_1 = new thrift_types.ContextItem();
                    contextItem_1.indexId = this.getIndexId();
                    contextItem_1.fieldName = fieldName;
                    contextItem_1.contextItemId = basketItem['id'];
                    contextItem_1.role = subRole;
                    this.contextItems.push(contextItem_1);
                });
            }
            this.addRelatedProducts(relatedProducts, relatedProductField);
        };
        BxRequest.prototype.addRelatedProducts = function (relatedProducts, relatedProductField) {
            if (relatedProductField === void 0) { relatedProductField = 'id'; }
            for (var productId in relatedProducts) {
                var related = relatedProducts[productId];
                var key = "bx_" + this.choiceId + "_" + productId;
                this.requestContextParameters[key] = related;
            }
        };
        BxRequest.prototype.getContextItems = function () {
            return this.contextItems;
        };
        BxRequest.prototype.getRequestContextParameters = function () {
            return this.requestContextParameters;
        };
        BxRequest.prototype.retrieveHitFieldValues = function (item, field, items, fields) {
            return Array();
        };
        return BxRequest;
    }());
    exports.BxRequest = BxRequest;
});
//# sourceMappingURL=BxRequest.js.map