(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BxBatchResponse = /** @class */ (function () {
        function BxBatchResponse(response, bxBatchProfileIds, bxBatchRequests) {
            if (bxBatchProfileIds === void 0) { bxBatchProfileIds = []; }
            if (bxBatchRequests === void 0) { bxBatchRequests = []; }
            this.bxBatchRequests = [];
            this.bxBatchProfileContextsIds = [];
            this.response = response;
            this.bxBatchRequests = Array.isArray(bxBatchRequests) ? bxBatchRequests : [bxBatchRequests];
            this.bxBatchProfileContextsIds = bxBatchProfileIds;
        }
        BxBatchResponse.prototype.getBatchResponse = function () {
            return this.response;
        };
        BxBatchResponse.prototype.getHitFieldValuesByProfileId = function (profileId) {
            var TmpReturn = [];
            if (this.profileItemsFromVariants == null) {
                this.getHitFieldValueForProfileIds();
            }
            if (this.profileItemsFromVariants != null && this.profileItemsFromVariants[profileId] != undefined) {
                TmpReturn = this.profileItemsFromVariants[profileId];
            }
            return TmpReturn;
        };
        BxBatchResponse.prototype.getHitFieldValueForProfileIds = function () {
            var profileItems = [];
            var key = 0;
            var TmpReturn = [];
            var obj = this;
            if (this.response == null || this.response.variants == null) {
                TmpReturn = [];
            }
            this.response.variants.forEach(function (variant) {
                var items = Array();
                if (variant == null || variant.searchResult == null || variant.searchResult.hitsGroups == null) {
                    TmpReturn = [];
                }
                variant.searchResult.hitsGroups.forEach(function (hitGroup) {
                    hitGroup.hits.forEach(function (hit) {
                        items.push(hit.values);
                    });
                });
                var context = obj.bxBatchProfileContextsIds[key];
                profileItems[context] = items;
                key += 1;
            });
            this.profileItemsFromVariants = profileItems;
            TmpReturn = this.profileItemsFromVariants;
            return TmpReturn;
        };
        BxBatchResponse.prototype.getHitValueByField = function (field) {
            var profileHits = Array();
            var key = 0;
            var Obj = this;
            this.response.variants.forEach(function (variant) {
                var values = Array();
                variant.searchResult.hitsGroups.forEach(function (hitGroup) {
                    hitGroup.hits.forEach(function (hit) {
                        values.push(hit.values[field][0]);
                    });
                });
                var context = Obj.bxBatchProfileContextsIds[key];
                profileHits[context] = values;
                key += 1;
            });
            return profileHits;
        };
        BxBatchResponse.prototype.getHitIds = function (field) {
            if (field === void 0) { field = 'id'; }
            var profileHits = [];
            var key = 0;
            var TmpReturn = [];
            var obj = this;
            if (this.response == null || this.response.variants == null) {
                TmpReturn = [];
            }
            this.response.variants.forEach(function (variant) {
                var values = Array();
                if (variant == null || variant.searchResult == null || variant.searchResult.hitsGroups == null) {
                    TmpReturn = [];
                }
                variant.searchResult.hitsGroups.forEach(function (hitGroup) {
                    hitGroup.hits.forEach(function (hit) {
                        values.push(hit.values[field][0]);
                    });
                });
                var context = obj.bxBatchProfileContextsIds[key];
                profileHits[context] = values;
                key += 1;
            });
            TmpReturn = profileHits;
            return TmpReturn;
        };
        return BxBatchResponse;
    }());
    exports.BxBatchResponse = BxBatchResponse;
});
//# sourceMappingURL=BxBatchResponse.js.map