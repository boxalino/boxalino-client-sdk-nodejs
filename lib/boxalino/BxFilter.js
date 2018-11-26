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
    var thrift_types = require('./bxthrift/p13n_types');
    var BxFilter = /** @class */ (function () {
        function BxFilter(fieldName, values, negative) {
            if (values === void 0) { values = Array(); }
            if (negative === void 0) { negative = false; }
            this.hierarchyId = null;
            this.hierarchy = null;
            this.rangeFrom = null;
            this.rangeTo = null;
            this.fieldName = fieldName;
            this.values = values;
            this.negative = negative;
        }
        BxFilter.prototype.getFieldName = function () {
            return this.fieldName;
        };
        BxFilter.prototype.getValues = function () {
            return this.values;
        };
        BxFilter.prototype.isNegative = function () {
            return this.negative;
        };
        BxFilter.prototype.getHierarchyId = function () {
            return this.hierarchyId;
        };
        BxFilter.prototype.setHierarchyId = function (hierarchyId) {
            this.hierarchyId = hierarchyId;
        };
        BxFilter.prototype.getHierarchy = function () {
            return this.hierarchy;
        };
        BxFilter.prototype.setHierarchy = function (hierarchy) {
            this.hierarchy = hierarchy;
        };
        BxFilter.prototype.getRangeFrom = function () {
            return this.rangeFrom;
        };
        BxFilter.prototype.setRangeFrom = function (rangeFrom) {
            this.rangeFrom = rangeFrom;
        };
        BxFilter.prototype.getRangeTo = function () {
            return this.rangeTo;
        };
        BxFilter.prototype.setRangeTo = function (rangeTo) {
            this.rangeTo = rangeTo;
        };
        BxFilter.prototype.getThriftFilter = function () {
            var filter = new thrift_types.Filter();
            filter.fieldName = this.fieldName;
            filter.negative = this.negative;
            filter.stringValues = this.values;
            if (this.hierarchyId) {
                filter.hierarchyId = this.hierarchyId;
            }
            if (this.hierarchy) {
                filter.hierarchy = this.hierarchy;
            }
            if (this.rangeFrom) {
                filter.rangeFrom = this.rangeFrom;
            }
            if (this.rangeTo) {
                filter.rangeTo = this.rangeTo;
            }
            return filter;
        };
        return BxFilter;
    }());
    exports.BxFilter = BxFilter;
});
//# sourceMappingURL=BxFilter.js.map