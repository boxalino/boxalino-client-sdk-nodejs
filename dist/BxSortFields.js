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
    var BxSortFields = /** @class */ (function () {
        function BxSortFields(field, reverse) {
            if (field === void 0) { field = null; }
            if (reverse === void 0) { reverse = false; }
            this.sorts = Array();
            if (field) {
                this.push(field, reverse);
            }
        }
        /**
         * @param field name od field to sort by (i.e. discountedPrice / title)
         * @param reverse true for ASC, false for DESC
         */
        BxSortFields.prototype.push = function (field, reverse) {
            if (reverse === void 0) { reverse = false; }
            this.sorts[field] = reverse;
        };
        BxSortFields.prototype.getSortFields = function () {
            return this.Array_keys(this.sorts);
        };
        BxSortFields.prototype.Array_keys = function (input) {
            var output = new Array();
            var counter = 0;
            for (var i in input) {
                output[counter++] = i;
            }
            return output;
        };
        BxSortFields.prototype.isFieldReverse = function (field) {
            if ((typeof (this.sorts[field]) != "undefined" && this.sorts[field] !== null) && this.sorts[field]) {
                return true;
            }
            return false;
        };
        BxSortFields.prototype.getThriftSortFields = function () {
            var sortFields = Array();
            var tempSortFields = this.getSortFields();
            tempSortFields.forEach(function (field) {
                sortFields.push(new thrift_types.SortField({ 'fieldName': field, 'reverse': this.isFieldReverse(field) }));
            });
            return sortFields;
        };
        return BxSortFields;
    }());
    exports.BxSortFields = BxSortFields;
});
//# sourceMappingURL=BxSortFields.js.map