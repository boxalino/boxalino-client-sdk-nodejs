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
    var BxFacets = /** @class */ (function () {
        function BxFacets() {
            this.facets = Array();
            this.parameterPrefix = "";
            this.priceFieldName = 'discountedPrice';
            this.priceRangeMargin = false;
            this.notificationLog = Array();
            this.notificationMode = false;
            this.facetKeyValuesCache = Array();
            this.lastSetMinCategoryLevel = 0;
            this.facetValueArrayCache = Array();
            this.filters = Array();
        }
        BxFacets.prototype.setNotificationMode = function (mode) {
            this.notificationMode = mode;
        };
        BxFacets.prototype.getNotificationMode = function () {
            return this.notificationMode;
        };
        BxFacets.prototype.addNotification = function (name, parameters) {
            if (this.notificationMode) {
                this.notificationLog.push({ 'name': name, 'parameters': parameters });
            }
        };
        BxFacets.prototype.getNotifications = function () {
            return this.notificationLog;
        };
        BxFacets.prototype.setSearchResults = function (searchResult) {
            this.searchResult = searchResult;
        };
        BxFacets.prototype.getCategoryFieldName = function () {
            return "categories";
        };
        BxFacets.prototype.getFilters = function () {
            return this.filters;
        };
        BxFacets.prototype.addCategoryFacet = function (selectedValue, order, maxCount, andSelectedValues, label) {
            if (selectedValue === void 0) { selectedValue = null; }
            if (order === void 0) { order = 2; }
            if (maxCount === void 0) { maxCount = -1; }
            if (andSelectedValues === void 0) { andSelectedValues = false; }
            if (label === void 0) { label = null; }
            if (selectedValue) {
                this.addFacet('category_id', selectedValue, 'hierarchical', null, 1, false, 1, andSelectedValues);
            }
            this.addFacet(this.getCategoryFieldName(), null, 'hierarchical', label, order, false, maxCount);
        };
        BxFacets.prototype.addPriceRangeFacet = function (selectedValue, order, label, fieldName, maxCount) {
            if (selectedValue === void 0) { selectedValue = null; }
            if (order === void 0) { order = 2; }
            if (label === void 0) { label = 'Price'; }
            if (fieldName === void 0) { fieldName = 'discountedPrice'; }
            if (maxCount === void 0) { maxCount = -1; }
            this.priceFieldName = fieldName;
            this.addRangedFacet(fieldName, selectedValue, label, order, true, maxCount);
        };
        BxFacets.prototype.addRangedFacet = function (fieldName, selectedValue, label, order, boundsOnly, maxCount) {
            if (selectedValue === void 0) { selectedValue = null; }
            if (label === void 0) { label = null; }
            if (order === void 0) { order = 2; }
            if (boundsOnly === void 0) { boundsOnly = false; }
            if (maxCount === void 0) { maxCount = -1; }
            this.addFacet(fieldName, selectedValue, 'ranged', label, order, boundsOnly, maxCount);
        };
        BxFacets.prototype.addFacet = function (fieldName, selectedValue, type, label, order, boundsOnly, maxCount, andSelectedValues) {
            if (selectedValue === void 0) { selectedValue = null; }
            if (type === void 0) { type = 'string'; }
            if (label === void 0) { label = null; }
            if (order === void 0) { order = 2; }
            if (boundsOnly === void 0) { boundsOnly = false; }
            if (maxCount === void 0) { maxCount = -1; }
            if (andSelectedValues === void 0) { andSelectedValues = false; }
            var selectedValues = Array();
            if (selectedValue != null) {
                selectedValues = (Array.isArray(selectedValue)) ? selectedValue : [selectedValue];
            }
            this.facets[fieldName] = {
                'label': label, 'type': type, 'order': order, 'selectedValues': selectedValues,
                'boundsOnly': boundsOnly, 'maxCount': maxCount, 'andSelectedValues': andSelectedValues
            };
        };
        BxFacets.prototype.setParameterPrefix = function (parameterPrefix) {
            this.parameterPrefix = parameterPrefix;
        };
        BxFacets.prototype.isCategories = function (fieldName) {
            return fieldName.index(this.getCategoryFieldName()) != false;
        };
        BxFacets.prototype.getFacetParameterName = function (fieldName) {
            var parameterName = fieldName;
            if (this.isCategories(fieldName)) {
                parameterName = 'category_id';
            }
            return this.parameterPrefix + parameterName;
        };
        BxFacets.prototype.getForceIncludedFieldNames = function (onlySelected) {
            if (onlySelected === void 0) { onlySelected = false; }
            var fieldNames = Array();
            if (this.forceIncludedFacets == null) {
                this.getFieldNames();
            }
            if (Array.isArray(this.forceIncludedFacets)) {
                if (onlySelected) {
                    this.searchResult.facetResponses.forEach(function (facetResponse) {
                        if (typeof (this.forceIncludedFacets[facetResponse.fieldName]) != "undefined" && this.forceIncludedFacets[facetResponse.fieldName] !== null) {
                            this.facetResponses.values.forEach(function (value) {
                                if (value.selected) {
                                    fieldNames[facetResponse.fieldName] = facetResponse.fieldName;
                                    return fieldNames;
                                }
                            });
                        }
                    });
                }
                else {
                    fieldNames = this.forceIncludedFacets;
                }
            }
            return fieldNames;
        };
        BxFacets.prototype.getSelectedSemanticFilterValues = function (field) {
            var selectedValues = Array();
            var fieldNames = this.getFieldNames();
            fieldNames.forEach(function (fieldName) {
                if (fieldName == field) {
                    this.getFacetResponse(fieldName).values.forEach(function (value) {
                        if (value.selected && (this.facets[fieldName]['selectedValues']).indexOf(value.stringValue) > 0) {
                            selectedValues.push(value.stringValue);
                        }
                    });
                    return selectedValues;
                }
            });
            return selectedValues;
        };
        BxFacets.prototype.getFieldNames = function () {
            var fieldNames = Array();
            if (this.searchResult && (this.facets.length) !== this.searchResult.facetResponses.length) {
                this.forceIncludedFacets = Array();
                this.searchResult.facetResponses.forEach(function (facetResponse) {
                    if (typeof (this.facets[facetResponse.fieldName]) == "undefined" && this.facets[facetResponse.fieldName] === null) {
                        this.facets[facetResponse.fieldName] = [{
                                'label': facetResponse.fieldName,
                                'type': facetResponse.numerical ? 'ranged' : 'list',
                                'order': this.facets.length,
                                'selectedValues': [],
                                'boundsOnly': facetResponse.range,
                                'maxCount': -1
                            }];
                        this.forceIncludedFacets[facetResponse.fieldName] = facetResponse.fieldName;
                    }
                });
            }
            for (var fieldName in this.facets) {
                var facet = this.facets[fieldName];
                var facetResponse = this.getFacetResponse(fieldName);
                if ((facetResponse != null) && ((facetResponse.values.length) > 0 || (facet['selectedValues'].length) > 0)) {
                    fieldNames[fieldName] = { 'fieldName': fieldName, 'returnedOrder': fieldNames.length };
                }
            }
            fieldNames.sort(function (a, b) {
                var aValue = parseInt(this.getFacetExtraInfo(a['fieldName'], 'order', a['returnedOrder']));
                if (aValue == 0) {
                    aValue = a['returnedOrder'];
                }
                var bValue = parseInt(this.getFacetExtraInfo(b['fieldName'], 'order', b['returnedOrder']));
                if (bValue == 0) {
                    bValue = b['returnedOrder'];
                }
                if (aValue == bValue)
                    return 0;
                return aValue > bValue ? 1 : -1;
            });
            return fieldNames.keys;
        };
        BxFacets.prototype.getDisplayFacets = function (display, ddefault) {
            if (ddefault === void 0) { ddefault = false; }
            var selectedFacets = Array();
            this.getFieldNames().forEach(function (fieldName) {
                if (this.getFacetDisplay(fieldName) == display || (this.getFacetDisplay(fieldName) == null && ddefault)) {
                    selectedFacets.push(fieldName);
                }
            });
            return selectedFacets;
        };
        BxFacets.prototype.getFacetExtraInfoFacets = function (extraInfoKey, extraInfoValue, ddefault, returnHidden, withSoftFacets) {
            if (ddefault === void 0) { ddefault = false; }
            if (returnHidden === void 0) { returnHidden = false; }
            if (withSoftFacets === void 0) { withSoftFacets = false; }
            var selectedFacets = Array();
            this.getFieldNames().forEach(function (fieldName) {
                if (!returnHidden && this.isFacetHidden(fieldName)) {
                    return true;
                }
                var facetValues = this.getFacetValues(fieldName);
                if (this.getFacetType(fieldName) != 'ranged' && (this.getTotalHitCount() > 0 && (facetValues.length) == 1)
                    && (parseFloat(this.getFacetExtraInfo(fieldName, "limitOneValueCoverage")) >= (parseFloat(this.getFacetValueCount(fieldName, facetValues[0])) / this.getTotalHitCount()))) {
                    return true;
                }
                if (this.getFacetExtraInfo(fieldName, extraInfoKey) == extraInfoValue || (this.getFacetExtraInfo(fieldName, extraInfoKey) == null && ddefault)) {
                    if (!withSoftFacets && this.getFacetExtraInfo(fieldName, 'isSoftFacet') == 'true') {
                        return true;
                    }
                    selectedFacets = fieldName;
                }
            });
            return selectedFacets;
        };
        BxFacets.prototype.getLeftFacets = function (returnHidden) {
            if (returnHidden === void 0) { returnHidden = false; }
            var leftFacets = this.getFacetExtraInfoFacets('position', 'left', true, returnHidden);
            this.addNotification('getLeftFacets', JSON.stringify(Array(returnHidden, leftFacets)));
            return leftFacets;
        };
        BxFacets.prototype.getTopFacets = function (returnHidden) {
            if (returnHidden === void 0) { returnHidden = false; }
            return this.getFacetExtraInfoFacets('position', 'top', false, returnHidden);
        };
        BxFacets.prototype.getBottomFacets = function (returnHidden) {
            if (returnHidden === void 0) { returnHidden = false; }
            return this.getFacetExtraInfoFacets('position', 'bottom', false, returnHidden);
        };
        BxFacets.prototype.getRightFacets = function (returnHidden) {
            if (returnHidden === void 0) { returnHidden = false; }
            return this.getFacetExtraInfoFacets('position', 'right', false, returnHidden);
        };
        BxFacets.prototype.getCPOFinderFacets = function (returnHidden) {
            if (returnHidden === void 0) { returnHidden = false; }
            return this.getFacetExtraInfoFacets('finderFacet', 'true', false, returnHidden, true);
        };
        BxFacets.prototype.getFacetResponseExtraInfo = function (facetResponse, extraInfoKey, defaultExtraInfoValue) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (facetResponse) {
                if (Array.isArray(facetResponse.extraInfo) && (facetResponse.extraInfo.length) > 0 && (typeof (facetResponse.extraInfo[extraInfoKey]) != "undefined" && facetResponse.extraInfo[extraInfoKey] !== null)) {
                    return facetResponse.extraInfo[extraInfoKey];
                }
                return defaultExtraInfoValue;
            }
            return defaultExtraInfoValue;
        };
        BxFacets.prototype.getFacetResponseDisplay = function (facetResponse, defaultDisplay) {
            if (defaultDisplay === void 0) { defaultDisplay = 'expanded'; }
            if (facetResponse) {
                if (facetResponse.display) {
                    return facetResponse.display;
                }
                return defaultDisplay;
            }
            return defaultDisplay;
        };
        BxFacets.prototype.getAllFacetExtraInfo = function (fieldName) {
            var extraInfo = null;
            if (fieldName == this.getCategoryFieldName()) {
                fieldName = 'category_id';
            }
            try {
                var facetResponse = this.getFacetResponse(fieldName);
                if ((facetResponse != null) && (Array.isArray(facetResponse.extraInfo)) && (facetResponse.extraInfo.length) > 0) {
                    return facetResponse.extraInfo;
                }
            }
            catch (ex) {
                return extraInfo;
            }
        };
        BxFacets.prototype.getFacetExtraInfo = function (fieldName, extraInfoKey, defaultExtraInfoValue) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (fieldName == this.getCategoryFieldName()) {
                fieldName = 'category_id';
            }
            try {
                var extraInfo = this.getFacetResponseExtraInfo(this.getFacetResponse(fieldName), extraInfoKey, defaultExtraInfoValue);
                this.addNotification('getFacetResponseExtraInfo', JSON.stringify(Array(fieldName, extraInfoKey, defaultExtraInfoValue, extraInfo)));
                return extraInfo;
            }
            catch (ex) {
                this.addNotification('Exception - getFacetResponseExtraInfo', JSON.stringify(Array(fieldName, extraInfoKey, defaultExtraInfoValue)));
                return defaultExtraInfoValue;
            }
        };
        BxFacets.prototype.prettyPrintLabel = function (label, prettyPrint) {
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (prettyPrint) {
                label = label.replace('_', ' ');
                label = label.replace('products', '');
                label = (label.charAt(0).toUpperCase());
            }
            return label;
        };
        BxFacets.prototype.getFacetLabel = function (fieldName, language, defaultValue, prettyPrint) {
            if (language === void 0) { language = null; }
            if (defaultValue === void 0) { defaultValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (typeof (this.facets[fieldName]) != "undefined" && this.facets[fieldName] !== null) {
                defaultValue = this.facets[fieldName]['label'];
            }
            if (defaultValue == null) {
                defaultValue = fieldName;
            }
            if (language != null) {
                var jsonLabel = this.getFacetExtraInfo(fieldName, "label");
                if (jsonLabel == null) {
                    return this.prettyPrintLabel(defaultValue, prettyPrint);
                }
                var labels = JSON.parse(jsonLabel);
                labels.forEach(function (label) {
                    if (language && label.language != language) {
                        return;
                    }
                    if (label.value != null) {
                        return this.prettyPrintLabel(label.value, prettyPrint);
                    }
                });
            }
            return this.prettyPrintLabel(defaultValue, prettyPrint);
        };
        BxFacets.prototype.showFacetValueCounters = function (fieldName, defaultValue) {
            if (defaultValue === void 0) { defaultValue = true; }
            return this.getFacetExtraInfo(fieldName, "showCounter", defaultValue ? "true" : "false") != "false";
        };
        BxFacets.prototype.getFacetIcon = function (fieldName, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            return this.getFacetExtraInfo(fieldName, "icon", defaultValue);
        };
        BxFacets.prototype.isFacetExpanded = function (fieldName, ddefault) {
            if (ddefault === void 0) { ddefault = true; }
            fieldName = fieldName == this.getCategoryFieldName() ? 'category_id' : fieldName;
            var defaultDisplay = ddefault ? 'expanded' : "";
            return this.getFacetDisplay(fieldName, defaultDisplay) == 'expanded';
        };
        BxFacets.prototype.getHideCoverageThreshold = function (fieldName, defaultHideCoverageThreshold) {
            if (defaultHideCoverageThreshold === void 0) { defaultHideCoverageThreshold = 0; }
            defaultHideCoverageThreshold = this.getFacetExtraInfo(fieldName, "minDisplayCoverage", defaultHideCoverageThreshold);
            return defaultHideCoverageThreshold;
        };
        BxFacets.prototype.getTotalHitCount = function () {
            return this.searchResult.totalHitCount;
        };
        BxFacets.prototype.getFacetCoverage = function (fieldName) {
            var coverage = 0;
            var temp = this.getFacetValues(fieldName);
            temp.forEach(function (facetValue) {
                coverage += this.getFacetValueCount(fieldName, facetValue);
            });
            return coverage;
        };
        BxFacets.prototype.isFacetHidden = function (fieldName, defaultHideCoverageThreshold) {
            if (defaultHideCoverageThreshold === void 0) { defaultHideCoverageThreshold = 0; }
            if (this.getFacetDisplay(fieldName) == 'hidden') {
                return true;
            }
            defaultHideCoverageThreshold = this.getHideCoverageThreshold(fieldName, defaultHideCoverageThreshold);
            if (defaultHideCoverageThreshold > 0 && (this.getSelectedValues(fieldName).length) == 0) {
                var ratio = this.getFacetCoverage(fieldName) / this.getTotalHitCount();
                return parseFloat(ratio) < defaultHideCoverageThreshold;
            }
            return false;
        };
        BxFacets.prototype.getFacetDisplay = function (fieldName, defaultDisplay) {
            if (defaultDisplay === void 0) { defaultDisplay = 'expanded'; }
            if (fieldName == this.getCategoryFieldName()) {
                fieldName = 'category_id';
            }
            try {
                if (this.getFacetSelectedValues(fieldName).length > 0) {
                    return 'expanded';
                }
                return this.getFacetResponseDisplay(this.getFacetResponse(fieldName), defaultDisplay);
            }
            catch (ex) {
                return defaultDisplay;
            }
        };
        BxFacets.prototype.getFacetResponse = function (fieldName) {
            var facetResp;
            if (this.searchResult != null && this.searchResult.facetResponses != null) {
                this.searchResult.facetResponses.forEach(function (facetResponse) {
                    if (facetResponse.fieldName == fieldName) {
                        facetResp = facetResponse;
                    }
                });
            }
            return facetResp;
        };
        BxFacets.prototype.getFacetType = function (fieldName) {
            var type = 'string';
            if (typeof (this.facets[fieldName]) != "undefined" && this.facets[fieldName] !== null) {
                type = this.facets[fieldName]['type'];
            }
            return type;
        };
        BxFacets.prototype.buildTree = function (response, parents, parentLevel) {
            if (parents === void 0) { parents = Array(); }
            if (parentLevel === void 0) { parentLevel = 0; }
            var obj = this;
            if (parents.length == 0) {
                parents = Array();
                response.forEach(function (node) {
                    if (node.hierarchy.length == 1) {
                        parents.push(node);
                    }
                });
                if (parents.length == 1) {
                    parents = parents[0].hierarchy;
                }
                else if (parents.length > 1) {
                    var children_1 = Array();
                    var hitCountSum_1 = 0;
                    parents.forEach(function (parent) {
                        children_1.push(this.buildTree(response, parent.hierarchy, parentLevel));
                        hitCountSum_1 += children_1[children_1.length - 1]['node'].hitCount;
                    });
                    var root = Array();
                    root['stringValue'] = '0/Root';
                    root['hitCount'] = hitCountSum_1;
                    root['hierarchyId'] = 0;
                    root['hierarchy'] = Array();
                    root['selected'] = false;
                    return { 'node': root, 'children': children_1 };
                }
            }
            var children = Array();
            response.forEach(function (node) {
                if (node.hierarchy.length == parentLevel + 2) {
                    var allTrue = true;
                    for (var k in parents) {
                        var v = parents[k];
                        if ((typeof (node.hierarchy[k]) == "undefined" && node.hierarchy[k] === null) || node.hierarchy[k] != v) {
                            allTrue = false;
                        }
                    }
                    if (allTrue) {
                        children.push(obj.buildTree(response, node.hierarchy, parentLevel + 1));
                    }
                }
            });
            response.forEach(function (node) {
                if (node.hierarchy.length == parentLevel + 1) {
                    var allTrue = true;
                    for (var k in node.hierarchy) {
                        var v = node.hierarchy[k];
                        if ((typeof (parents[k]) == "undefined" && parents[k] === null) || parents[k] != v) {
                            allTrue = false;
                        }
                    }
                    if (allTrue) {
                        return { 'node': node, 'children': children };
                    }
                }
            });
            return null;
        };
        BxFacets.prototype.getFirstNodeWithSeveralChildren = function (tree, minCategoryLevel) {
            if (minCategoryLevel === void 0) { minCategoryLevel = 0; }
            if (tree == null) {
                return null;
            }
            if (tree['children'].length == 0) {
                return null;
            }
            if (tree['children'].length > 1 && minCategoryLevel <= 0) {
                return tree;
            }
            var bestTree = tree['children'][0];
            if (tree['children'].length > 1) {
                tree['children'].forEach(function (node) {
                    if (node['node'].hitCount > bestTree['node'].hitCount) {
                        bestTree = node;
                    }
                });
            }
            this.getFirstNodeWithSeveralChildren(bestTree, minCategoryLevel - 1);
        };
        BxFacets.prototype.getFacetSelectedValues = function (fieldName) {
            var selectedValues = Array();
            this.getFacetKeysValues(fieldName).forEach(function (val) {
                if ((typeof (val.stringValue) != "undefined" && val.stringValue !== null) && val.selected) {
                    selectedValues.push(val.stringValue.toString());
                }
            });
            return selectedValues;
        };
        BxFacets.prototype.getSelectedTreeNode = function (tree) {
            var selectedCategoryId = null;
            if ((typeof (this.facets['category_id']) != "undefined" && this.facets['category_id'] !== null) &&
                (typeof (this.facets['category_id']['selectedValues']) != "undefined" && this.facets['category_id']['selectedValues'] !== null)) {
                selectedCategoryId = this.facets['category_id']['selectedValues'][0];
            }
            if (selectedCategoryId == null) {
                try {
                    var values = this.getFacetSelectedValues('category_id');
                    if (values.length > 0) {
                        selectedCategoryId = values[0];
                    }
                }
                catch (ex) {
                }
            }
            if (selectedCategoryId == null) {
                return tree;
            }
            if (tree == null || tree['node'] == null) {
                return null;
            }
            var tempPart = tree['node'].stringValue;
            var parts = tempPart.split('/');
            if (parts[0] == selectedCategoryId) {
                return tree;
            }
            tree['children'].forEach(function (node) {
                var result = this.getSelectedTreeNode(node);
                if (result != null) {
                    return result;
                }
            });
            return null;
        };
        BxFacets.prototype.getCategoryById = function (categoryId) {
            var facetResponse = this.getFacetResponse(this.getCategoryFieldName());
            if (facetResponse != null) {
                if (facetResponse.values != null) {
                    facetResponse.values.forEach(function (bxFacet) {
                        if (bxFacet.hierarchyId == categoryId) {
                            return categoryId;
                        }
                    });
                }
            }
            return null;
        };
        BxFacets.prototype.getFacetKeysValues = function (fieldName, ranking, minCategoryLevel) {
            if (ranking === void 0) { ranking = 'alphabetical'; }
            if (minCategoryLevel === void 0) { minCategoryLevel = 0; }
            if (this.facetKeyValuesCache != null) {
                if (typeof (this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel]) != "undefined" && (this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel]) !== null) {
                    return this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel];
                }
            }
            if (fieldName == "") {
                return Array();
            }
            if (fieldName == 'category_id')
                return Array();
            var facetValues = Array();
            var facetResponse = this.getFacetResponse(fieldName);
            if (facetResponse == null || facetResponse == undefined) {
                return Array();
            }
            var type = this.getFacetType(fieldName);
            switch (type) {
                case 'hierarchical':
                    var tree = this.buildTree(facetResponse.values);
                    tree = this.getSelectedTreeNode(tree);
                    var node = this.getFirstNodeWithSeveralChildren(tree, minCategoryLevel);
                    if (node && !node.empty && node != null && node['children'] != null) {
                        node['children'].forEach(function (node) {
                            facetValues[node['node'].stringValue] = node['node'];
                        });
                    }
                    break;
                case 'ranged':
                    var displayRange_1 = JSON.parse(this.getFacetExtraInfo(fieldName, 'bx_displayPriceRange'));
                    facetResponse.values.forEach(function (facetValue) {
                        if (displayRange_1) {
                            facetValue.rangeFromInclusive = displayRange_1[0] !== null ? displayRange_1[0].toString() : facetValue.rangeFromInclusive.toString();
                            facetValue.rangeToExclusive = displayRange_1[1] != null ? displayRange_1[1].toString() : facetValue.rangeToExclusive.toString();
                        }
                        facetValues[facetValue.rangeFromInclusive + '-' + facetValue.rangeToExclusive] = facetValue;
                    });
                    break;
                default:
                    facetResponse.values.forEach(function (facetValue) {
                        facetValues[facetValue.stringValue] = facetValue;
                    });
                    if (Array.isArray(this.facets[fieldName]['selectedValues'])) {
                        this.facets[fieldName]['selectedValues'].forEach(function (value) {
                            if (typeof (facetValues[value]) != "undefined" && facetValues[value] === null) {
                                var newValue = new thrift_types.FacetValue();
                                newValue.rangeFromInclusive = null;
                                newValue.rangeToExclusive = null;
                                newValue.hierarchyId = null;
                                newValue.hierarchy = null;
                                newValue.stringValue = value;
                                newValue.hitCount = 0;
                                newValue.selected = true;
                                facetValues[value] = newValue;
                            }
                        });
                    }
                    break;
            }
            var overWriteRanking = this.getFacetExtraInfo(fieldName, "valueorderEnums");
            if (overWriteRanking == "counter") {
                ranking = 'counter';
            }
            if (overWriteRanking == "alphabetical") {
                ranking = 'alphabetical';
            }
            if (ranking == 'counter') {
                facetValues.sort(function (a, b) {
                    if (a.hitCount > b.hitCount) {
                        return -1;
                    }
                    else if (b.hitCount > a.hitCount) {
                        return 1;
                    }
                    return 0;
                });
            }
            var displaySelectedValues = this.getFacetExtraInfo(fieldName, "displaySelectedValues");
            if (displaySelectedValues == "only") {
                var finalFacetValues = Array();
                for (var k in facetValues) {
                    var v = facetValues[k];
                    if (v.selected) {
                        finalFacetValues[k] = v;
                    }
                }
                facetValues = (finalFacetValues == null) ? facetValues : finalFacetValues;
            }
            if (displaySelectedValues == "top") {
                var finalFacetValues = Array();
                for (var k in facetValues) {
                    var v = facetValues[k];
                    if (v.selected) {
                        finalFacetValues[k] = v;
                    }
                }
                for (var k in facetValues) {
                    var v = facetValues[k];
                    if (!v.selected) {
                        finalFacetValues[k] = v;
                    }
                }
                facetValues = finalFacetValues;
            }
            facetValues = this.applyDependencies(fieldName, facetValues);
            var enumDisplaySize = parseInt(this.getFacetExtraInfo(fieldName, "enumDisplayMaxSize"));
            if (enumDisplaySize > 0 && facetValues.length > enumDisplaySize) {
                var enumDisplaySizeMin = parseInt(this.getFacetExtraInfo(fieldName, "enumDisplaySize"));
                if (enumDisplaySizeMin == 0) {
                    enumDisplaySizeMin = enumDisplaySize;
                }
                var finalFacetValues = Array();
                for (var k in facetValues) {
                    var v = facetValues[k];
                    if (finalFacetValues.length >= enumDisplaySizeMin) {
                        v.hidden = true;
                    }
                    finalFacetValues[k] = v;
                }
                facetValues = finalFacetValues;
            }
            this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel] = facetValues;
            return facetValues;
        };
        BxFacets.prototype.applyDependencies = function (fieldName, values) {
            var dependencies = JSON.parse(this.getFacetExtraInfo(fieldName, "jsonDependencies"));
            if (dependencies != null && !dependencies.empty) {
                dependencies.forEach(function (dependency) {
                    if (dependency['values'].empty)
                        return true;
                    if (dependency['conditions'].empty) {
                        var effect = dependency['effect'];
                        if (effect['hide'] == 'true') {
                            dependency['values'].forEach(function (value) {
                                if (typeof (values[value]) != "undefined" && values[value] !== null) {
                                    // unset(values[value]);
                                    var index = values.indexOf(value);
                                    if (index > -1) {
                                        this.values.splice(value, 1);
                                    }
                                }
                            });
                        }
                        else if (effect['hide'] == '') {
                            var temp = Array();
                            for (var key in dependency['values']) {
                                var value = dependency['values'][key];
                                if (typeof (values[value]) != "undefined" && values[value] !== null) {
                                    temp[value] = values[value];
                                    // unset(values[value]);
                                    var index = values.indexOf(value);
                                    if (index > -1) {
                                        this.values.splice(value, 1);
                                    }
                                }
                            }
                            // Array_splice(values, effect['order'], 0, temp);
                            temp = values[effect['order']] = temp;
                            temp = values;
                            values = Array();
                            temp.forEach(function (value) {
                                values[value.stringValue] = value;
                            });
                        }
                    }
                });
            }
            return values;
        };
        BxFacets.prototype.getSelectedValues = function (fieldName) {
            var selectedValues = Array();
            try {
                var temp = this.getFacetValues(fieldName);
                temp.forEach(function (key) {
                    if (this.isFacetValueSelected(fieldName, key)) {
                        selectedValues.push(key);
                    }
                });
            }
            catch (ex) {
                if (typeof (this.facets[fieldName]['selectedValues']) != "undefined"
                    && this.facets[fieldName]['selectedValues'] !== null) {
                    return this.facets[fieldName]['selectedValues'];
                }
            }
            return selectedValues;
        };
        BxFacets.prototype.getFacetByFieldName = function (fieldName) {
            for (var fn in this.facets) {
                var facet = this.facets[fn];
                if (fieldName == fn) {
                    return facet;
                }
            }
            return null;
        };
        BxFacets.prototype.isSelected = function (fieldName, ignoreCategories) {
            if (ignoreCategories === void 0) { ignoreCategories = false; }
            if (fieldName == "") {
                return false;
            }
            if (this.isCategories(fieldName)) {
                if (ignoreCategories) {
                    return false;
                }
            }
            if (this.getSelectedValues(fieldName).length > 0) {
                return true;
            }
            var facet = this.getFacetByFieldName(fieldName);
            if (facet != null) {
                if (facet['type'] == 'hierarchical') {
                    var facetResponse = this.getFacetResponse(fieldName);
                    if (facetResponse == null) {
                        return false;
                    }
                    var tree = this.buildTree(facetResponse.values);
                    tree = this.getSelectedTreeNode(tree);
                    return tree && tree['node'].hierarchy.length > 1;
                }
                return ((typeof (this.facets[fieldName]['selectedValues']) != "undefined"
                    && this.facets[fieldName]['selectedValues'] !== null)
                    && (this.facets[fieldName]['selectedValues'].length) > 0);
            }
            return false;
        };
        BxFacets.prototype.getTreeParent = function (tree, treeEnd) {
            tree['children'].forEach(function (child) {
                if (child['node'].stringValue == treeEnd['node'].stringValue) {
                    return tree;
                }
                parent = this.getTreeParent(child, treeEnd);
                if (parent) {
                    return parent;
                }
            });
            return null;
        };
        BxFacets.prototype.getParentCategories = function () {
            var fieldName = this.getCategoryFieldName();
            var facetResponse = this.getFacetResponse(fieldName);
            if (facetResponse == null) {
                return Array();
            }
            var tree = this.buildTree(facetResponse.values);
            var treeEnd = this.getSelectedTreeNode(tree);
            if ((treeEnd && treeEnd.empty) || treeEnd == null) {
                return Array();
            }
            if (treeEnd['node'].stringValue == tree['node'].stringValue) {
                return Array();
            }
            var parents = Array();
            var parent = treeEnd;
            while (parent) {
                var temp = parent['node'].stringValue;
                var parts = temp.split('/');
                if (parts[0] != 0) {
                    parents.push(Array(parts[0], parts[parts.length - 1]));
                }
                parent = this.getTreeParent(tree, parent);
            }
            // krsort(parents);
            parents.reverse();
            var final = Array();
            parents.forEach(function (v) {
                final[v[0]] = v[1];
            });
            return final;
        };
        BxFacets.prototype.getParentCategoriesHitCount = function (id) {
            var fieldName = this.getCategoryFieldName();
            var facetResponse = this.getFacetResponse(fieldName);
            if (facetResponse == null) {
                return 0;
            }
            var tree = this.buildTree(facetResponse.values);
            var treeEnd = this.getSelectedTreeNode(tree);
            if (treeEnd == null) {
                return tree['node'].hitCount;
            }
            if (treeEnd['node'].stringValue == tree['node'].stringValue) {
                return tree['node'].hitCount;
            }
            var parent = treeEnd;
            while (parent) {
                if (parent['node'].hierarchyId == id) {
                    return parent['node'].hitCount;
                }
                parent = this.getTreeParent(tree, parent);
            }
            return 0;
        };
        BxFacets.prototype.getSelectedValueLabel = function (fieldName, index) {
            if (index === void 0) { index = 0; }
            if (fieldName == "") {
                return "";
            }
            var svs = this.getSelectedValues(fieldName);
            if (typeof (svs[index]) != "undefined" && svs[index] !== null) {
                return this.getFacetValueLabel(fieldName, svs[index]);
            }
            var facet = this.getFacetByFieldName(fieldName);
            if (facet != null) {
                if (facet['type'] == 'hierarchical') {
                    var facetResponse = this.getFacetResponse(fieldName);
                    if (typeof (facetResponse) != "undefined" && facetResponse !== null) {
                        return '';
                    }
                    var tree = this.buildTree(facetResponse.values);
                    tree = this.getSelectedTreeNode(tree);
                    var tem = tree['node'].stringValue;
                    var parts = tem.spit('/');
                    return parts[parts.length - 1];
                }
                if (facet['type'] == 'ranged') {
                    if (typeof (this.facets[fieldName]['selectedValues'][0]) != "undefined" && (this.facets[fieldName]['selectedValues'][0]) !== null) {
                        return (this.facets[fieldName]['selectedValues'][0]);
                    }
                }
                if (typeof (facet['selectedValues'][0]) !== "undefined" && facet['selectedValues'][0] !== null) {
                    return facet['selectedValues'][0];
                }
                return "";
            }
            return "";
        };
        BxFacets.prototype.getPriceFieldName = function () {
            return this.priceFieldName;
        };
        BxFacets.prototype.getCategoriesKeyLabels = function () {
            var categoryValueArray = Array();
            var temp = this.getCategories();
            temp.forEach(function (v) {
                var label = this.getCategoryValueLabel(v);
                categoryValueArray[label] = v;
            });
            return categoryValueArray;
        };
        BxFacets.prototype.getCategoryIdsFromLevel = function (level) {
            var facetResponse = this.getFacetResponse(this.getCategoryFieldName());
            var ids = Array();
            if (facetResponse !== null) {
                facetResponse.values.forEach(function (category) {
                    if (category.hierarchy.length == level + 2) {
                        ids.push(category.hierarchyId);
                    }
                });
                facetResponse.values.forEach(function (category) {
                    if (category.hierarchy.length == level + 2) {
                        ids.push(category.hierarchyId);
                    }
                });
            }
            return ids;
        };
        BxFacets.prototype.getCategoryFromLevel = function (level) {
            var facetResponse = this.getFacetResponse(this.getCategoryFieldName());
            var categories = Array();
            if (facetResponse !== null) {
                facetResponse.values.forEach(function (category) {
                    if (category.hierarchy.length == level + 2) {
                        categories.push(category.hierarchyId);
                    }
                });
            }
            return categories;
        };
        BxFacets.prototype.getSelectedCategoryIds = function () {
            var ids = Array();
            if (typeof (this.facets['category_id']) != "undefined" && this.facets['category_id'] !== null) {
                ids = this.facets['category_id']['selectedValues'];
            }
            return ids;
        };
        BxFacets.prototype.getCategories = function (ranking, minCategoryLevel) {
            if (ranking === void 0) { ranking = 'alphabetical'; }
            if (minCategoryLevel === void 0) { minCategoryLevel = 0; }
            return this.getFacetValues(this.getCategoryFieldName(), ranking, minCategoryLevel);
        };
        BxFacets.prototype.getPriceRanges = function () {
            return this.getFacetValues(this.getPriceFieldName());
        };
        BxFacets.prototype.getFacetValues = function (fieldName, ranking, minCategoryLevel) {
            if (ranking === void 0) { ranking = 'alphabetical'; }
            if (minCategoryLevel === void 0) { minCategoryLevel = 0; }
            this.lastSetMinCategoryLevel = minCategoryLevel;
            return this.Array_keys(this.getFacetKeysValues(fieldName, ranking, minCategoryLevel));
        };
        BxFacets.prototype.Array_keys = function (input) {
            var output = new Array();
            var counter = 0;
            for (var i in input) {
                output[counter++] = i;
            }
            return output;
        };
        BxFacets.prototype.getFacetValueArray = function (fieldName, facetValue) {
            var fv;
            var from;
            var to;
            var paramValue;
            var valueLabel;
            var hash = fieldName + ' - ' + facetValue;
            if (this.facetValueArrayCache[hash] != undefined && this.facetValueArrayCache[hash] !== null) {
                return this.facetValueArrayCache[hash];
            }
            var keyValues = this.getFacetKeysValues(fieldName, 'alphabetical', this.lastSetMinCategoryLevel);
            if ((fieldName == this.priceFieldName) && (this.selectedPriceValues != null) && this.selectedPriceValues != undefined && (this.selectedPriceValues).length > 0) {
                fv = keyValues;
                from = Number(this.selectedPriceValues[0].rangeFromInclusive).toFixed(2);
                to = Number(this.selectedPriceValues[0].rangeToExclusive).toFixed(2);
                if (this.priceRangeMargin) {
                    to -= 0.01;
                }
                to = Number(to).toFixed(2);
                valueLabel = from + ' - ' + to;
                paramValue = from + ' - ' + to;
                this.facetValueArrayCache[hash] = Array(valueLabel, paramValue, fv[facetValue].hitCount, true, false);
                return this.facetValueArrayCache[hash];
            }
            if (Array.isArray(facetValue)) {
                facetValue = facetValue;
            }
            if (keyValues[facetValue] == null && fieldName == this.getCategoryFieldName()) {
                var facetResponse = this.getFacetResponse(this.getCategoryFieldName());
                if (facetResponse != null) {
                    /*facetResponse.values.forEach(function (bxFacet: any) {
                        if (bxFacet.hierarchyId == facetValue) {
                            keyValues[facetValue] = bxFacet;
                        }
                    });*/
                    for (var conData = 0; conData < facetResponse.values.length; conData++) {
                        if (facetResponse.values[conData].hierarchyId == facetValue) {
                            keyValues[facetValue] = facetResponse.values[conData];
                        }
                    }
                }
            }
            if (keyValues[facetValue] === null) {
                throw new Error("Requesting an invalid facet values for fieldname: " + fieldName + ", requested value: " + facetValue + ", available values . " + this.Array_keys(keyValues).join(','));
            }
            var type = this.getFacetType(fieldName);
            fv = (typeof (keyValues[facetValue]) != "undefined" && keyValues[facetValue] !== null) ? keyValues[facetValue] : null;
            var hidden = (fv != null && (typeof (fv.hidden) != "undefined" && fv.hidden !== null)) ? fv.hidden : false;
            switch (type) {
                case 'hierarchical':
                    var temp = fv.stringValue;
                    var parts = temp.split("/");
                    this.facetValueArrayCache[hash] = [parts[parts.length - 1], parts[0], fv.hitCount, fv.selected, hidden];
                    return this.facetValueArrayCache[hash];
                case 'ranged':
                    from = Number(fv.rangeFromInclusive).toFixed(2);
                    to = Number(fv.rangeToExclusive).toFixed(2);
                    valueLabel = from + ' - ' + to;
                    paramValue = fv.stringValue;
                    paramValue = "from-to";
                    this.facetValueArrayCache[hash] = Array(valueLabel, paramValue, fv.hitCount, fv.selected, hidden);
                    return this.facetValueArrayCache[hash];
                default:
                    fv = keyValues[facetValue];
                    this.facetValueArrayCache[hash] = Array(fv.stringValue, fv.stringValue, fv.hitCount, fv.selected, hidden);
                    return this.facetValueArrayCache[hash];
            }
        };
        BxFacets.prototype.getCategoryValueLabel = function (facetValue) {
            return this.getFacetValueLabel(this.getCategoryFieldName(), facetValue);
        };
        BxFacets.prototype.getSelectedPriceRange = function () {
            var valueLabel = null;
            if (this.selectedPriceValues !== null && (this.selectedPriceValues != null)) {
                var from = this.selectedPriceValues[0].rangeFromInclusive.round(2);
                var to = this.selectedPriceValues[0].rangeToExclusive;
                if (this.priceRangeMargin) {
                    to -= 0.01;
                }
                to = to.round(2);
                valueLabel = from + '-' + to;
            }
            return valueLabel;
        };
        BxFacets.prototype.getPriceValueLabel = function (facetValue) {
            return this.getFacetValueLabel(this.getPriceFieldName(), facetValue);
        };
        BxFacets.prototype.getFacetValueLabel = function (fieldName, facetValue) {
            var tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            var label = tempFacetVal[0];
            var parameterValue = tempFacetVal[1];
            var hitCount = tempFacetVal[2];
            var selected = tempFacetVal[3];
            return label;
        };
        BxFacets.prototype.getCategoryValueCount = function (facetValue) {
            return this.getFacetValueCount(this.getCategoryFieldName(), facetValue);
        };
        BxFacets.prototype.getPriceValueCount = function (facetValue) {
            return this.getFacetValueCount(this.getPriceFieldName(), facetValue);
        };
        BxFacets.prototype.getFacetValueCount = function (fieldName, facetValue) {
            var tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            var label = tempFacetVal[0];
            var parameterValue = tempFacetVal[1];
            var hitCount = tempFacetVal[2];
            var selected = tempFacetVal[3];
            return hitCount;
        };
        BxFacets.prototype.isFacetValueHidden = function (fieldName, facetValue) {
            var tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            var label = tempFacetVal[0];
            var parameterValue = tempFacetVal[1];
            var hitCount = tempFacetVal[2];
            var selected = tempFacetVal[3];
            var hidden = tempFacetVal[4];
            return hidden;
        };
        BxFacets.prototype.getCategoryValueId = function (facetValue) {
            return this.getFacetValueParameterValue(this.getCategoryFieldName(), facetValue);
        };
        BxFacets.prototype.getPriceValueParameterValue = function (facetValue) {
            return this.getFacetValueParameterValue(this.getPriceFieldName(), facetValue);
        };
        BxFacets.prototype.getFacetValueParameterValue = function (fieldName, facetValue) {
            var tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            var label = tempFacetVal[0];
            var parameterValue = tempFacetVal[1];
            var hitCount = tempFacetVal[2];
            var selected = tempFacetVal[3];
            return parameterValue;
        };
        BxFacets.prototype.isPriceValueSelected = function (facetValue) {
            return this.isFacetValueSelected(this.getPriceFieldName(), facetValue);
        };
        BxFacets.prototype.isFacetValueSelected = function (fieldName, facetValue) {
            var tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            var label = tempFacetVal[0];
            var parameterValue = tempFacetVal[1];
            var hitCount = tempFacetVal[2];
            var selected = tempFacetVal[3];
            return selected;
        };
        BxFacets.prototype.getFacetValueIcon = function (fieldName, facetValue, language, defaultValue) {
            if (language === void 0) { language = null; }
            if (defaultValue === void 0) { defaultValue = ''; }
            facetValue = facetValue.toLowerCase();
            var iconMap = JSON.parse(this.getFacetExtraInfo(fieldName, 'iconMap'));
            iconMap.forEach(function (icon) {
                if (language && icon.language != language) {
                    return;
                }
                if (facetValue == icon.value.toLowerCase()) {
                    return icon.icon;
                }
            });
            return defaultValue;
        };
        BxFacets.prototype.getThriftFacets = function () {
            var thriftFacets = Array();
            for (var fieldName in this.facets) {
                var facet = this.facets[fieldName];
                var type = facet['type'];
                var order = facet['order'];
                var maxCount = facet['maxCount'];
                var andSelectedValues = facet['andSelectedValues'];
                if (fieldName == this.priceFieldName) {
                    this.selectedPriceValues = this.facetSelectedValue(fieldName, type);
                }
                var facetRequest = new thrift_types.FacetRequest();
                facetRequest.fieldName = fieldName;
                facetRequest.numerical = type == 'ranged' ? true : type == 'numerical' ? true : false;
                facetRequest.range = type == 'ranged' ? true : false;
                facetRequest.boundsOnly = facet['boundsOnly'];
                facetRequest.selectedValues = this.facetSelectedValue(fieldName, type);
                facetRequest.andSelectedValues = andSelectedValues;
                facetRequest.sortOrder = (typeof (order) != "undefined" && order !== null) && order == 1 ? 1 : 2;
                facetRequest.maxCount = (typeof (maxCount) != "undefined" && maxCount !== null) && maxCount > 0 ? maxCount : -1;
                thriftFacets.push(facetRequest);
            }
            return thriftFacets;
        };
        BxFacets.prototype.facetSelectedValue = function (fieldName, option) {
            var selectedFacets = Array();
            if (this.facets[fieldName]['selectedValues'] != undefined && (this.facets[fieldName]['selectedValues']) !== null && (this.facets[fieldName]['selectedValues']).length > 0) {
                this.facets[fieldName]['selectedValues'].forEach(function (value) {
                    var selectedFacet = new thrift_types.FacetValue();
                    if (option == 'ranged') {
                        var rangedValue = value.split('-');
                        if (rangedValue[0] != '*') {
                            selectedFacet.rangeFromInclusive = parseFloat(rangedValue[0]);
                        }
                        if (rangedValue[1] != '*') {
                            selectedFacet.rangeToExclusive = parseFloat(rangedValue[1]);
                            if (rangedValue[0] == rangedValue[1]) {
                                this.priceRangeMargin = true;
                                selectedFacet.rangeToExclusive += 0.01;
                            }
                        }
                    }
                    else {
                        selectedFacet.stringValue = value;
                    }
                    selectedFacets.push(selectedFacet);
                });
                return selectedFacets;
            }
            return;
        };
        BxFacets.prototype.getParentId = function (fieldName, id) {
            var hierarchy = Array();
            this.searchResult.facetResponses.forEach(function (response) {
                if (response.fieldName == fieldName) {
                    response.values.forEach(function (item) {
                        if (item.hierarchyId == id) {
                            hierarchy = item.hierarchy;
                            if (hierarchy.count < 4) {
                                return 1;
                            }
                        }
                    });
                    response.values.forEach(function (item) {
                        if (item.hierarchy.count == (hierarchy.count - 1)) {
                            if (item.hierarchy[hierarchy.count - 2] === hierarchy[hierarchy.count - 2]) {
                                return item.hierarchyId;
                            }
                        }
                    });
                }
            });
        };
        return BxFacets;
    }());
    exports.BxFacets = BxFacets;
});
//# sourceMappingURL=BxFacets.js.map