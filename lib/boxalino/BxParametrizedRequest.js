var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
        define(["require", "exports", "./BxRequest", "./BxFacets", "./BxSortFields", "./BxFilter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BxRequest_1 = require("./BxRequest");
    var BxFacets_1 = require("./BxFacets");
    var BxSortFields_1 = require("./BxSortFields");
    var BxFilter_1 = require("./BxFilter");
    var BxParametrizedRequest = /** @class */ (function (_super) {
        __extends(BxParametrizedRequest, _super);
        function BxParametrizedRequest(language, choiceId, max, min, bxReturnFields, getItemFieldsCB) {
            if (max === void 0) { max = 10; }
            if (min === void 0) { min = 0; }
            if (bxReturnFields === void 0) { bxReturnFields = null; }
            if (getItemFieldsCB === void 0) { getItemFieldsCB = null; }
            var _this = _super.call(this, language, choiceId, max, min) || this;
            _this.bxReturnFields = Array('id');
            _this.getItemFieldsCB = null;
            _this.requestParametersPrefix = "";
            _this.requestWeightedParametersPrefix = "bxrpw_";
            _this.requestFiltersPrefix = "bxfi_";
            _this.requestFacetsPrefix = "bxfa_";
            _this.requestSortFieldPrefix = "bxsf_";
            _this.requestReturnFieldsName = "bxrf";
            _this.requestContextItemFieldName = "bxcif";
            _this.requestContextItemFieldValues = "bxciv";
            _this.callBackCache = null;
            _this.requestParameterExclusionPatterns = Array();
            if (bxReturnFields != null) {
                _this.bxReturnFields = bxReturnFields;
            }
            _this.getItemFieldsCB = getItemFieldsCB;
            return _this;
        }
        BxParametrizedRequest.prototype.setRequestParametersPrefix = function (requestParametersPrefix) {
            this.requestParametersPrefix = requestParametersPrefix;
        };
        BxParametrizedRequest.prototype.getRequestParametersPrefix = function () {
            return this.requestParametersPrefix;
        };
        BxParametrizedRequest.prototype.setRequestWeightedParametersPrefix = function (requestWeightedParametersPrefix) {
            this.requestWeightedParametersPrefix = requestWeightedParametersPrefix;
        };
        BxParametrizedRequest.prototype.getRequestWeightedParametersPrefix = function () {
            return this.requestWeightedParametersPrefix;
        };
        BxParametrizedRequest.prototype.setRequestFiltersPrefix = function (requestFiltersPrefix) {
            this.requestFiltersPrefix = requestFiltersPrefix;
        };
        BxParametrizedRequest.prototype.getRequestFiltersPrefix = function () {
            return this.requestFiltersPrefix;
        };
        BxParametrizedRequest.prototype.setRequestFacetsPrefix = function (requestFacetsPrefix) {
            this.requestFacetsPrefix = requestFacetsPrefix;
        };
        BxParametrizedRequest.prototype.getRequestFacetsPrefix = function () {
            return this.requestFacetsPrefix;
        };
        BxParametrizedRequest.prototype.setRequestSortFieldPrefix = function (requestSortFieldPrefix) {
            this.requestSortFieldPrefix = requestSortFieldPrefix;
        };
        BxParametrizedRequest.prototype.getRequestSortFieldPrefix = function () {
            return this.requestSortFieldPrefix;
        };
        BxParametrizedRequest.prototype.setRequestReturnFieldsName = function (requestReturnFieldsName) {
            this.requestReturnFieldsName = requestReturnFieldsName;
        };
        BxParametrizedRequest.prototype.getRequestReturnFieldsName = function () {
            return this.requestReturnFieldsName;
        };
        BxParametrizedRequest.prototype.setRequestContextItemFieldName = function (requestContextItemFieldName) {
            this.requestContextItemFieldName = requestContextItemFieldName;
        };
        BxParametrizedRequest.prototype.getRequestContextItemFieldName = function () {
            return this.requestContextItemFieldName;
        };
        BxParametrizedRequest.prototype.setRequestContextItemFieldValues = function (requestContextItemFieldValues) {
            this.requestContextItemFieldValues = requestContextItemFieldValues;
        };
        BxParametrizedRequest.prototype.getRequestContextItemFieldValues = function () {
            return this.requestContextItemFieldValues;
        };
        BxParametrizedRequest.prototype.getPrefixes = function () {
            return Array(this.requestParametersPrefix, this.requestWeightedParametersPrefix, this.requestFiltersPrefix, this.requestFacetsPrefix, this.requestSortFieldPrefix);
        };
        BxParametrizedRequest.prototype.matchesPrefix = function (string, prefix, checkOtherPrefixes) {
            if (checkOtherPrefixes === void 0) { checkOtherPrefixes = true; }
            if (checkOtherPrefixes) {
                this.getPrefixes().forEach(function (p) {
                    if (p == prefix) {
                        return true;
                    }
                    if (prefix.length < p.length && string.indexOf(p) === 0) {
                        return false;
                    }
                });
            }
            return prefix == null || string.indexOf(prefix) === 0;
        };
        BxParametrizedRequest.prototype.getPrefixedParameters = function (prefix, checkOtherPrefixes) {
            if (checkOtherPrefixes === void 0) { checkOtherPrefixes = true; }
            var params = Array();
            if (Array.isArray(this.requestMap) === false) {
                return Array();
            }
            this.requestMap.forEach(function (k) {
                var v = this.requestMap[k];
                if (this.matchesPrefix(k, prefix, checkOtherPrefixes)) {
                    params[k.substring(prefix.length)] = v;
                }
            });
            return params;
        };
        BxParametrizedRequest.prototype.getContextItems = function () {
            var contextItemFieldName = null;
            var contextItemFieldValues = Array();
            var params = this.getPrefixedParameters(this.requestParametersPrefix, false);
            params.forEach(function (name) {
                var values = params[name];
                var value;
                if (name == this.requestContextItemFieldName) {
                    value = values;
                    if (Array.isArray(value) && value.length > 0) {
                        value = values[0];
                    }
                    contextItemFieldName = value;
                    return;
                }
                if (name == this.requestContextItemFieldValues) {
                    value = values;
                    if (!Array.isArray(value)) {
                        value = values.split(',');
                    }
                    contextItemFieldValues = value;
                    return;
                }
                params[name] = values;
            });
            if (contextItemFieldName) {
                contextItemFieldValues.forEach(function (contextItemFieldValue) {
                    this.setProductContext(contextItemFieldName, contextItemFieldValue);
                });
            }
            return _super.prototype.getContextItems.call(this);
        };
        BxParametrizedRequest.prototype.getRequestParameterExclusionPatterns = function () {
            return this.requestParameterExclusionPatterns;
        };
        BxParametrizedRequest.prototype.addRequestParameterExclusionPatterns = function (pattern) {
            this.requestParameterExclusionPatterns.push(pattern);
        };
        BxParametrizedRequest.prototype.getRequestContextParameters = function () {
            var params = Array();
            this.getPrefixedParameters(this.requestWeightedParametersPrefix).forEach(function (name) {
                var values = this.getPrefixedParameters(this.requestWeightedParametersPrefix)[name];
                params[name] = values;
            });
            this.getPrefixedParameters(this.requestParametersPrefix, false).forEach(function (name) {
                var values = this.getPrefixedParameters(this.requestParametersPrefix, false)[name];
                if (name.indexOf(this.requestWeightedParametersPrefix) !== false) {
                    return;
                }
                if (name.indexOf(this.requestFiltersPrefix) !== false) {
                    return;
                }
                if (name.indexOf(this.requestFacetsPrefix) !== false) {
                    return;
                }
                if (name.indexOf(this.requestSortFieldPrefix) !== false) {
                    return;
                }
                if (name == this.requestReturnFieldsName) {
                    return;
                }
                params[name] = values;
            });
            params = this.unset(params, 'bxi_data_owner_expert');
            return params;
        };
        BxParametrizedRequest.prototype.getWeightedParameters = function () {
            var params = Array();
            this.getPrefixedParameters(this.requestWeightedParametersPrefix).forEach(function (name) {
                var values = this.getPrefixedParameters(this.requestWeightedParametersPrefix)[name];
                var pieces = name.split('_');
                var fieldValue = "";
                if (pieces.length > 0) {
                    fieldValue = pieces[pieces.length - 1];
                    this.unset(pieces, [pieces.length - 1]);
                }
                var fieldName = pieces.join('_');
                if (params[fieldName] === null) {
                    params[fieldName] = Array();
                }
                params[fieldName][fieldValue] = values;
            });
            return params;
        };
        BxParametrizedRequest.prototype.getFilters = function () {
            var filters = _super.prototype.getFilters.call(this);
            this.getPrefixedParameters(this.requestFiltersPrefix).forEach(function (fieldName) {
                var value = this.getPrefixedParameters(this.requestFiltersPrefix)[fieldName];
                var negative = false;
                if (value.indexOf('!') === 0) {
                    negative = true;
                    value = value.substr(1);
                }
                filters.push(new BxFilter_1.BxFilter(fieldName, Array(value), negative));
            });
            return filters;
        };
        BxParametrizedRequest.prototype.getFacets = function () {
            var facets = _super.prototype.getFacets.call(this);
            if (facets == null) {
                facets = new BxFacets_1.BxFacets();
            }
            this.getPrefixedParameters(this.requestFacetsPrefix).forEach(function (fieldName) {
                var selectedValue = this.getPrefixedParameters(this.requestFacetsPrefix)[fieldName];
                facets.addFacet(fieldName, selectedValue);
            });
            return facets;
        };
        BxParametrizedRequest.prototype.getSortFields = function () {
            var sortFields = _super.prototype.getSortFields.call(this);
            if (sortFields == null) {
                sortFields = new BxSortFields_1.BxSortFields();
            }
            this.getPrefixedParameters(this.requestSortFieldPrefix).forEach(function (name) {
                var value = this.getPrefixedParameters(this.requestSortFieldPrefix)[name];
                sortFields.push(name, value);
            });
            return sortFields;
        };
        BxParametrizedRequest.prototype.getReturnFields = function () {
            var unique = (_super.prototype.getReturnFields.call(this).concat(this.bxReturnFields)).filter(this.array_unique);
            return unique;
        };
        BxParametrizedRequest.prototype.array_unique = function (value, index, self) {
            return self.indexOf(value) === index;
        };
        BxParametrizedRequest.prototype.getAllReturnFields = function () {
            var returnFields = this.getReturnFields();
            if (typeof (this.requestMap[this.requestReturnFieldsName]) != "undefined" && this.requestMap[this.requestReturnFieldsName] !== null) {
                returnFields = (returnFields.concat(this.requestMap[this.requestReturnFieldsName].split(',')).filter(this.array_unique));
            }
            return returnFields;
        };
        BxParametrizedRequest.prototype.retrieveFromCallBack = function (items, fields) {
            if (this.callBackCache === null) {
                this.callBackCache = Array();
                var ids_1 = Array();
                items.forEach(function (item) {
                    ids_1.push(item.values['id'][0]);
                });
            }
            return this.callBackCache;
        };
        BxParametrizedRequest.prototype.retrieveHitFieldValues = function (item, field, items, fields) {
            var itemFields = this.retrieveFromCallBack(items, fields);
            if (typeof (itemFields[item.values['id'][0]][field]) != "undefined" && itemFields[item.values['id'][0]][field] !== null) {
                return itemFields[item.values['id'][0]][field];
            }
            return _super.prototype.retrieveHitFieldValues.call(this, item, field, items, fields);
        };
        BxParametrizedRequest.prototype.unset = function (myArray, key) {
            var index = myArray.indexOf(key, 0);
            if (index > -1) {
                myArray.splice(index, 1);
            }
            return myArray;
        };
        return BxParametrizedRequest;
    }(BxRequest_1.BxRequest));
    exports.BxParametrizedRequest = BxParametrizedRequest;
});
//# sourceMappingURL=BxParametrizedRequest.js.map