var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BxRequest", "./BxFacets", "./BxSortFields"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BxRequest_1 = require("./BxRequest");
    var BxFacets_1 = require("./BxFacets");
    var BxSortFields_1 = require("./BxSortFields");
    var thrift_types = require('./bxthrift/p13n_types.js');
    var BxBatchRequest = /** @class */ (function (_super) {
        __extends(BxBatchRequest, _super);
        function BxBatchRequest(language, choiceId, max, min) {
            if (max === void 0) { max = 10; }
            if (min === void 0) { min = 0; }
            var _this = _super.call(this, language, choiceId, max, min) || this;
            _this.max = 10;
            _this.min = 0;
            _this.profileIds = [];
            _this.choiceInquiryList = [];
            _this.isTest = false;
            _this.isDev = false;
            _this.requestContextParameters = [];
            _this.profileContextList = [];
            _this.sameInquiry = true;
            if (choiceId == null) {
                throw new Error("BxBatchRequest created with null choiceId");
            }
            _this.language = language;
            _this.choiceId = choiceId;
            _this.max = max;
            _this.min = min;
            _this.sameInquiry = true;
            _this.requestContextParameters = [];
            _this.profileContextList = [];
            _this.profileIds = [];
            _this.choiceInquiryList = [];
            //configurations from parent initialize
            _this.bxFacets = new BxFacets_1.BxFacets();
            _this.bxSortFields = new BxSortFields_1.BxSortFields(); //Array.new
            _this.bxFilters = [];
            _this.orFilters = false;
            _this.hitsGroupsAsHits = null;
            _this.withRelaxation = choiceId == 'search';
            _this.contextItems = [];
            _this.returnFields = [];
            return _this;
        }
        BxBatchRequest.prototype.getChoiceInquiryList = function () {
            if (this.profileIds.length < 1) {
                return [];
            }
            //NOte TO COMMENTED
            //this.choiceInquiryList = [];
            if (this.sameInquiry == true) {
                var choiceInquiry = this.createMainInquiry();
                this.choiceInquiryList.push(choiceInquiry);
            }
            return this.choiceInquiryList;
        };
        BxBatchRequest.prototype.getProfileContextList = function (setOfProfileIds) {
            if (setOfProfileIds === void 0) { setOfProfileIds = Array(); }
            if (this.profileIds.length < 1 && setOfProfileIds.length < 1) {
                return [];
            }
            // this.profileIds = setOfProfileIds;
            if (setOfProfileIds.length < 1) {
                this.profileIds = this.getProfileIds();
            }
            this.profileContextList = [];
            var Obj = this;
            this.profileIds.forEach(function (id) {
                Obj.addProfileContext(id);
            });
            return this.profileContextList;
        };
        BxBatchRequest.prototype.getSimpleSearchQuery = function () {
            var searchQuery = new thrift_types.SimpleSearchQuery();
            searchQuery.indexId = this.getIndexId();
            searchQuery.language = this.language;
            searchQuery.returnFields = this.getReturnFields();
            searchQuery.hitCount = this.max;
            searchQuery.queryText = this.getQuerytext();
            searchQuery.groupBy = this.getGroupBy();
            var _temp = this.getFilters();
            if (_temp != null) {
                if (_temp.length > 0) {
                    searchQuery.filters = Array();
                    this.getFilters().forEach(function (filter) {
                        searchQuery.filters.push(filter[1].getThriftFilter);
                    });
                }
            }
            searchQuery.orFilters = this.getOrFilters();
            if (this.getSortFields()) {
                searchQuery.sortFields = this.getSortFields().getThriftSortFields;
            }
            return searchQuery;
        };
        BxBatchRequest.prototype.getRequestContext = function (id) {
            var requestContext = new thrift_types.RequestContext();
            requestContext.parameters = [];
            if (this.requestContextParameters != null && this.requestContextParameters.length > 0) {
                Object.keys(this.requestContextParameters).forEach(function (k) {
                    requestContext.parameters[k] = this.requestContextParameters[k];
                });
            }
            requestContext.parameters['customerId'] = [String(id)];
            return requestContext;
        };
        BxBatchRequest.prototype.createMainInquiry = function () {
            var choiceInquiry = new thrift_types.ChoiceInquiry();
            choiceInquiry.choiceId = this.choiceId;
            if (this.isTest == true || (this.isDev == true && this.isTest == null)) {
                choiceInquiry.choiceId = this.choiceId + "_debugtest";
            }
            choiceInquiry.simpleSearchQuery = this.getSimpleSearchQuery();
            choiceInquiry.contextItems = this.getContextItems();
            choiceInquiry.minHitCount = this.min;
            choiceInquiry.withRelaxation = this.getWithRelaxation();
            return choiceInquiry;
        };
        BxBatchRequest.prototype.addProfileContext = function (id, requestContext) {
            if (requestContext === void 0) { requestContext = null; }
            if (requestContext == null) {
                requestContext = this.getRequestContext(id);
            }
            var profileContext = new thrift_types.ProfileContext();
            profileContext.profileId = id;
            profileContext.requestContext = requestContext;
            this.profileContextList.push(profileContext);
            return this.profileContextList;
        };
        BxBatchRequest.prototype.addChoiceInquiry = function (newChoiceInquiry) {
            this.choiceInquiryList.push(newChoiceInquiry);
            return this.choiceInquiryList;
        };
        BxBatchRequest.prototype.setUseSameChoiceInquiry = function (sameInquiry) {
            this.sameInquiry = sameInquiry;
        };
        BxBatchRequest.prototype.setProfileIds = function (ids) {
            this.profileIds = ids;
        };
        BxBatchRequest.prototype.getProfileIds = function () {
            return this.profileIds;
        };
        BxBatchRequest.prototype.getContextItems = function () {
            return this.contextItems;
        };
        BxBatchRequest.prototype.setRequestContextParameters = function (requestParams) {
            this.requestContextParameters = requestParams;
        };
        BxBatchRequest.prototype.setIsDev = function (dev) {
            this.isDev = dev;
        };
        return BxBatchRequest;
    }(BxRequest_1.BxRequest));
    exports.BxBatchRequest = BxBatchRequest;
});
//# sourceMappingURL=BxBatchRequest.js.map