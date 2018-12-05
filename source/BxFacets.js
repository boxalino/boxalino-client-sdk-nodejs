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
    let thrift_types = require('./bxthrift/p13n_types');
    class BxFacets {
        constructor() {
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
        setNotificationMode(mode) {
            this.notificationMode = mode;
        }
        getNotificationMode() {
            return this.notificationMode;
        }
        addNotification(name, parameters) {
            if (this.notificationMode) {
                this.notificationLog.push({ 'name': name, 'parameters': parameters });
            }
        }
        getNotifications() {
            return this.notificationLog;
        }
        setSearchResults(searchResult) {
            this.searchResult = searchResult;
        }
        getCategoryFieldName() {
            return "categories";
        }
        getFilters() {
            return this.filters;
        }
        addCategoryFacet(selectedValue = null, order = 2, maxCount = -1, andSelectedValues = false, label = null) {
            if (selectedValue) {
                this.addFacet('category_id', selectedValue, 'hierarchical', null, 1, false, 1, andSelectedValues);
            }
            this.addFacet(this.getCategoryFieldName(), null, 'hierarchical', label, order, false, maxCount);
        }
        addPriceRangeFacet(selectedValue = null, order = 2, label = 'Price', fieldName = 'discountedPrice', maxCount = -1) {
            this.priceFieldName = fieldName;
            this.addRangedFacet(fieldName, selectedValue, label, order, true, maxCount);
        }
        addRangedFacet(fieldName, selectedValue = null, label = null, order = 2, boundsOnly = false, maxCount = -1) {
            this.addFacet(fieldName, selectedValue, 'ranged', label, order, boundsOnly, maxCount);
        }
        addFacet(fieldName, selectedValue = null, type = 'string', label = null, order = 2, boundsOnly = false, maxCount = -1, andSelectedValues = false) {
            let selectedValues = Array();
            if (selectedValue != null) {
                selectedValues = (Array.isArray(selectedValue)) ? selectedValue : [selectedValue];
            }
            this.facets[fieldName] = {
                'label': label, 'type': type, 'order': order, 'selectedValues': selectedValues,
                'boundsOnly': boundsOnly, 'maxCount': maxCount, 'andSelectedValues': andSelectedValues
            };
        }
        setParameterPrefix(parameterPrefix) {
            this.parameterPrefix = parameterPrefix;
        }
        isCategories(fieldName) {
            return fieldName.index(this.getCategoryFieldName()) != false;
        }
        getFacetParameterName(fieldName) {
            let parameterName = fieldName;
            if (this.isCategories(fieldName)) {
                parameterName = 'category_id';
            }
            return this.parameterPrefix + parameterName;
        }
        getForceIncludedFieldNames(onlySelected = false) {
            let fieldNames = Array();
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
        }
        getSelectedSemanticFilterValues(field) {
            let selectedValues = Array();
            let fieldNames = this.getFieldNames();
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
        }
        getFieldNames() {
            let fieldNames = Array();
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
            for (let fieldName in this.facets) {
                let facet = this.facets[fieldName];
                let facetResponse = this.getFacetResponse(fieldName);
                if ((facetResponse != null) && ((facetResponse.values.length) > 0 || (facet['selectedValues'].length) > 0)) {
                    fieldNames[fieldName] = { 'fieldName': fieldName, 'returnedOrder': fieldNames.length };
                }
            }
            fieldNames.sort(function (a, b) {
                let aValue = parseInt(this.getFacetExtraInfo(a['fieldName'], 'order', a['returnedOrder']));
                if (aValue == 0) {
                    aValue = a['returnedOrder'];
                }
                let bValue = parseInt(this.getFacetExtraInfo(b['fieldName'], 'order', b['returnedOrder']));
                if (bValue == 0) {
                    bValue = b['returnedOrder'];
                }
                if (aValue == bValue)
                    return 0;
                return aValue > bValue ? 1 : -1;
            });
            return fieldNames.keys;
        }
        getDisplayFacets(display, ddefault = false) {
            let selectedFacets = Array();
            this.getFieldNames().forEach(function (fieldName) {
                if (this.getFacetDisplay(fieldName) == display || (this.getFacetDisplay(fieldName) == null && ddefault)) {
                    selectedFacets.push(fieldName);
                }
            });
            return selectedFacets;
        }
        getFacetExtraInfoFacets(extraInfoKey, extraInfoValue, ddefault = false, returnHidden = false, withSoftFacets = false) {
            let selectedFacets = Array();
            this.getFieldNames().forEach(function (fieldName) {
                if (!returnHidden && this.isFacetHidden(fieldName)) {
                    return true;
                }
                let facetValues = this.getFacetValues(fieldName);
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
        }
        getLeftFacets(returnHidden = false) {
            let leftFacets = this.getFacetExtraInfoFacets('position', 'left', true, returnHidden);
            this.addNotification('getLeftFacets', JSON.stringify(Array(returnHidden, leftFacets)));
            return leftFacets;
        }
        getTopFacets(returnHidden = false) {
            return this.getFacetExtraInfoFacets('position', 'top', false, returnHidden);
        }
        getBottomFacets(returnHidden = false) {
            return this.getFacetExtraInfoFacets('position', 'bottom', false, returnHidden);
        }
        getRightFacets(returnHidden = false) {
            return this.getFacetExtraInfoFacets('position', 'right', false, returnHidden);
        }
        getCPOFinderFacets(returnHidden = false) {
            return this.getFacetExtraInfoFacets('finderFacet', 'true', false, returnHidden, true);
        }
        getFacetResponseExtraInfo(facetResponse, extraInfoKey, defaultExtraInfoValue = null) {
            if (facetResponse) {
                if (Array.isArray(facetResponse.extraInfo) && (facetResponse.extraInfo.length) > 0 && (typeof (facetResponse.extraInfo[extraInfoKey]) != "undefined" && facetResponse.extraInfo[extraInfoKey] !== null)) {
                    return facetResponse.extraInfo[extraInfoKey];
                }
                return defaultExtraInfoValue;
            }
            return defaultExtraInfoValue;
        }
        getFacetResponseDisplay(facetResponse, defaultDisplay = 'expanded') {
            if (facetResponse) {
                if (facetResponse.display) {
                    return facetResponse.display;
                }
                return defaultDisplay;
            }
            return defaultDisplay;
        }
        getAllFacetExtraInfo(fieldName) {
            let extraInfo = null;
            if (fieldName == this.getCategoryFieldName()) {
                fieldName = 'category_id';
            }
            try {
                let facetResponse = this.getFacetResponse(fieldName);
                if ((facetResponse != null) && (Array.isArray(facetResponse.extraInfo)) && (facetResponse.extraInfo.length) > 0) {
                    return facetResponse.extraInfo;
                }
            }
            catch (ex) {
                return extraInfo;
            }
        }
        getFacetExtraInfo(fieldName, extraInfoKey, defaultExtraInfoValue = null) {
            if (fieldName == this.getCategoryFieldName()) {
                fieldName = 'category_id';
            }
            try {
                let extraInfo = this.getFacetResponseExtraInfo(this.getFacetResponse(fieldName), extraInfoKey, defaultExtraInfoValue);
                this.addNotification('getFacetResponseExtraInfo', JSON.stringify(Array(fieldName, extraInfoKey, defaultExtraInfoValue, extraInfo)));
                return extraInfo;
            }
            catch (ex) {
                this.addNotification('Exception - getFacetResponseExtraInfo', JSON.stringify(Array(fieldName, extraInfoKey, defaultExtraInfoValue)));
                return defaultExtraInfoValue;
            }
        }
        prettyPrintLabel(label, prettyPrint = false) {
            if (prettyPrint) {
                label = label.replace('_', ' ');
                label = label.replace('products', '');
                label = (label.charAt(0).toUpperCase());
            }
            return label;
        }
        getFacetLabel(fieldName, language = null, defaultValue = null, prettyPrint = false) {
            if (typeof (this.facets[fieldName]) != "undefined" && this.facets[fieldName] !== null) {
                defaultValue = this.facets[fieldName]['label'];
            }
            if (defaultValue == null) {
                defaultValue = fieldName;
            }
            if (language != null) {
                let jsonLabel = this.getFacetExtraInfo(fieldName, "label");
                if (jsonLabel == null) {
                    return this.prettyPrintLabel(defaultValue, prettyPrint);
                }
                let labels = JSON.parse(jsonLabel);
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
        }
        showFacetValueCounters(fieldName, defaultValue = true) {
            return this.getFacetExtraInfo(fieldName, "showCounter", defaultValue ? "true" : "false") != "false";
        }
        getFacetIcon(fieldName, defaultValue = null) {
            return this.getFacetExtraInfo(fieldName, "icon", defaultValue);
        }
        isFacetExpanded(fieldName, ddefault = true) {
            fieldName = fieldName == this.getCategoryFieldName() ? 'category_id' : fieldName;
            let defaultDisplay = ddefault ? 'expanded' : "";
            return this.getFacetDisplay(fieldName, defaultDisplay) == 'expanded';
        }
        getHideCoverageThreshold(fieldName, defaultHideCoverageThreshold = 0) {
            defaultHideCoverageThreshold = this.getFacetExtraInfo(fieldName, "minDisplayCoverage", defaultHideCoverageThreshold);
            return defaultHideCoverageThreshold;
        }
        getTotalHitCount() {
            return this.searchResult.totalHitCount;
        }
        getFacetCoverage(fieldName) {
            let coverage = 0;
            let temp = this.getFacetValues(fieldName);
            temp.forEach(function (facetValue) {
                coverage += this.getFacetValueCount(fieldName, facetValue);
            });
            return coverage;
        }
        isFacetHidden(fieldName, defaultHideCoverageThreshold = 0) {
            if (this.getFacetDisplay(fieldName) == 'hidden') {
                return true;
            }
            defaultHideCoverageThreshold = this.getHideCoverageThreshold(fieldName, defaultHideCoverageThreshold);
            if (defaultHideCoverageThreshold > 0 && (this.getSelectedValues(fieldName).length) == 0) {
                let ratio = this.getFacetCoverage(fieldName) / this.getTotalHitCount();
                return parseFloat(ratio) < defaultHideCoverageThreshold;
            }
            return false;
        }
        getFacetDisplay(fieldName, defaultDisplay = 'expanded') {
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
        }
        getFacetResponse(fieldName) {
            let facetResp;
            if (this.searchResult != null && this.searchResult.facetResponses != null) {
                this.searchResult.facetResponses.forEach(function (facetResponse) {
                    if (facetResponse.fieldName == fieldName) {
                        facetResp = facetResponse;
                    }
                });
            }
            return facetResp;
        }
        getFacetType(fieldName) {
            let type = 'string';
            if (typeof (this.facets[fieldName]) != "undefined" && this.facets[fieldName] !== null) {
                type = this.facets[fieldName]['type'];
            }
            return type;
        }
        buildTree(response, parents = Array(), parentLevel = 0) {
            let obj = this;
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
                    let children = Array();
                    let hitCountSum = 0;
                    parents.forEach(function (parent) {
                        children.push(this.buildTree(response, parent.hierarchy, parentLevel));
                        hitCountSum += children[children.length - 1]['node'].hitCount;
                    });
                    let root = Array();
                    root['stringValue'] = '0/Root';
                    root['hitCount'] = hitCountSum;
                    root['hierarchyId'] = 0;
                    root['hierarchy'] = Array();
                    root['selected'] = false;
                    return { 'node': root, 'children': children };
                }
            }
            let children = Array();
            response.forEach(function (node) {
                if (node.hierarchy.length == parentLevel + 2) {
                    let allTrue = true;
                    for (let k in parents) {
                        let v = parents[k];
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
                    let allTrue = true;
                    for (let k in node.hierarchy) {
                        let v = node.hierarchy[k];
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
        }
        getFirstNodeWithSeveralChildren(tree, minCategoryLevel = 0) {
            if (tree == null) {
                return null;
            }
            if (tree['children'].length == 0) {
                return null;
            }
            if (tree['children'].length > 1 && minCategoryLevel <= 0) {
                return tree;
            }
            let bestTree = tree['children'][0];
            if (tree['children'].length > 1) {
                tree['children'].forEach(function (node) {
                    if (node['node'].hitCount > bestTree['node'].hitCount) {
                        bestTree = node;
                    }
                });
            }
            this.getFirstNodeWithSeveralChildren(bestTree, minCategoryLevel - 1);
        }
        getFacetSelectedValues(fieldName) {
            let selectedValues = Array();
            this.getFacetKeysValues(fieldName).forEach(function (val) {
                if ((typeof (val.stringValue) != "undefined" && val.stringValue !== null) && val.selected) {
                    selectedValues.push(val.stringValue.toString());
                }
            });
            return selectedValues;
        }
        getSelectedTreeNode(tree) {
            let selectedCategoryId = null;
            if ((typeof (this.facets['category_id']) != "undefined" && this.facets['category_id'] !== null) &&
                (typeof (this.facets['category_id']['selectedValues']) != "undefined" && this.facets['category_id']['selectedValues'] !== null)) {
                selectedCategoryId = this.facets['category_id']['selectedValues'][0];
            }
            if (selectedCategoryId == null) {
                try {
                    let values = this.getFacetSelectedValues('category_id');
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
            let tempPart = tree['node'].stringValue;
            let parts = tempPart.split('/');
            if (parts[0] == selectedCategoryId) {
                return tree;
            }
            tree['children'].forEach(function (node) {
                let result = this.getSelectedTreeNode(node);
                if (result != null) {
                    return result;
                }
            });
            return null;
        }
        getCategoryById(categoryId) {
            let facetResponse = this.getFacetResponse(this.getCategoryFieldName());
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
        }
        getFacetKeysValues(fieldName, ranking = 'alphabetical', minCategoryLevel = 0) {
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
            let facetValues = Array();
            let facetResponse = this.getFacetResponse(fieldName);
            if (facetResponse == null || facetResponse == undefined) {
                return Array();
            }
            let type = this.getFacetType(fieldName);
            switch (type) {
                case 'hierarchical':
                    let tree = this.buildTree(facetResponse.values);
                    tree = this.getSelectedTreeNode(tree);
                    let node = this.getFirstNodeWithSeveralChildren(tree, minCategoryLevel);
                    if (node && !node.empty && node != null && node['children'] != null) {
                        node['children'].forEach(function (node) {
                            facetValues[node['node'].stringValue] = node['node'];
                        });
                    }
                    break;
                case 'ranged':
                    let displayRange = JSON.parse(this.getFacetExtraInfo(fieldName, 'bx_displayPriceRange'));
                    facetResponse.values.forEach(function (facetValue) {
                        if (displayRange) {
                            facetValue.rangeFromInclusive = displayRange[0] !== null ? displayRange[0].toString() : facetValue.rangeFromInclusive.toString();
                            facetValue.rangeToExclusive = displayRange[1] != null ? displayRange[1].toString() : facetValue.rangeToExclusive.toString();
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
                                let newValue = new thrift_types.FacetValue();
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
            let overWriteRanking = this.getFacetExtraInfo(fieldName, "valueorderEnums");
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
            let displaySelectedValues = this.getFacetExtraInfo(fieldName, "displaySelectedValues");
            if (displaySelectedValues == "only") {
                let finalFacetValues = Array();
                for (let k in facetValues) {
                    let v = facetValues[k];
                    if (v.selected) {
                        finalFacetValues[k] = v;
                    }
                }
                facetValues = (finalFacetValues == null) ? facetValues : finalFacetValues;
            }
            if (displaySelectedValues == "top") {
                let finalFacetValues = Array();
                for (let k in facetValues) {
                    let v = facetValues[k];
                    if (v.selected) {
                        finalFacetValues[k] = v;
                    }
                }
                for (let k in facetValues) {
                    let v = facetValues[k];
                    if (!v.selected) {
                        finalFacetValues[k] = v;
                    }
                }
                facetValues = finalFacetValues;
            }
            facetValues = this.applyDependencies(fieldName, facetValues);
            let enumDisplaySize = parseInt(this.getFacetExtraInfo(fieldName, "enumDisplayMaxSize"));
            if (enumDisplaySize > 0 && facetValues.length > enumDisplaySize) {
                let enumDisplaySizeMin = parseInt(this.getFacetExtraInfo(fieldName, "enumDisplaySize"));
                if (enumDisplaySizeMin == 0) {
                    enumDisplaySizeMin = enumDisplaySize;
                }
                let finalFacetValues = Array();
                for (let k in facetValues) {
                    let v = facetValues[k];
                    if (finalFacetValues.length >= enumDisplaySizeMin) {
                        v.hidden = true;
                    }
                    finalFacetValues[k] = v;
                }
                facetValues = finalFacetValues;
            }
            this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel] = facetValues;
            return facetValues;
        }
        applyDependencies(fieldName, values) {
            let dependencies = JSON.parse(this.getFacetExtraInfo(fieldName, "jsonDependencies"));
            if (dependencies != null && !dependencies.empty) {
                dependencies.forEach(function (dependency) {
                    if (dependency['values'].empty)
                        return true;
                    if (dependency['conditions'].empty) {
                        let effect = dependency['effect'];
                        if (effect['hide'] == 'true') {
                            dependency['values'].forEach(function (value) {
                                if (typeof (values[value]) != "undefined" && values[value] !== null) {
                                    // unset(values[value]);
                                    let index = values.indexOf(value);
                                    if (index > -1) {
                                        this.values.splice(value, 1);
                                    }
                                }
                            });
                        }
                        else if (effect['hide'] == '') {
                            let temp = Array();
                            for (let key in dependency['values']) {
                                let value = dependency['values'][key];
                                if (typeof (values[value]) != "undefined" && values[value] !== null) {
                                    temp[value] = values[value];
                                    // unset(values[value]);
                                    let index = values.indexOf(value);
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
        }
        getSelectedValues(fieldName) {
            let selectedValues = Array();
            try {
                let temp = this.getFacetValues(fieldName);
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
        }
        getFacetByFieldName(fieldName) {
            for (let fn in this.facets) {
                let facet = this.facets[fn];
                if (fieldName == fn) {
                    return facet;
                }
            }
            return null;
        }
        isSelected(fieldName, ignoreCategories = false) {
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
            let facet = this.getFacetByFieldName(fieldName);
            if (facet != null) {
                if (facet['type'] == 'hierarchical') {
                    let facetResponse = this.getFacetResponse(fieldName);
                    if (facetResponse == null) {
                        return false;
                    }
                    let tree = this.buildTree(facetResponse.values);
                    tree = this.getSelectedTreeNode(tree);
                    return tree && tree['node'].hierarchy.length > 1;
                }
                return ((typeof (this.facets[fieldName]['selectedValues']) != "undefined"
                    && this.facets[fieldName]['selectedValues'] !== null)
                    && (this.facets[fieldName]['selectedValues'].length) > 0);
            }
            return false;
        }
        getTreeParent(tree, treeEnd) {
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
        }
        getParentCategories() {
            let fieldName = this.getCategoryFieldName();
            let facetResponse = this.getFacetResponse(fieldName);
            if (facetResponse == null) {
                return Array();
            }
            let tree = this.buildTree(facetResponse.values);
            let treeEnd = this.getSelectedTreeNode(tree);
            if ((treeEnd && treeEnd.empty) || treeEnd == null) {
                return Array();
            }
            if (treeEnd['node'].stringValue == tree['node'].stringValue) {
                return Array();
            }
            let parents = Array();
            let parent = treeEnd;
            while (parent) {
                let temp = parent['node'].stringValue;
                let parts = temp.split('/');
                if (parts[0] != 0) {
                    parents.push(Array(parts[0], parts[parts.length - 1]));
                }
                parent = this.getTreeParent(tree, parent);
            }
            // krsort(parents);
            parents.reverse();
            let final = Array();
            parents.forEach(function (v) {
                final[v[0]] = v[1];
            });
            return final;
        }
        getParentCategoriesHitCount(id) {
            let fieldName = this.getCategoryFieldName();
            let facetResponse = this.getFacetResponse(fieldName);
            if (facetResponse == null) {
                return 0;
            }
            let tree = this.buildTree(facetResponse.values);
            let treeEnd = this.getSelectedTreeNode(tree);
            if (treeEnd == null) {
                return tree['node'].hitCount;
            }
            if (treeEnd['node'].stringValue == tree['node'].stringValue) {
                return tree['node'].hitCount;
            }
            let parent = treeEnd;
            while (parent) {
                if (parent['node'].hierarchyId == id) {
                    return parent['node'].hitCount;
                }
                parent = this.getTreeParent(tree, parent);
            }
            return 0;
        }
        getSelectedValueLabel(fieldName, index = 0) {
            if (fieldName == "") {
                return "";
            }
            let svs = this.getSelectedValues(fieldName);
            if (typeof (svs[index]) != "undefined" && svs[index] !== null) {
                return this.getFacetValueLabel(fieldName, svs[index]);
            }
            let facet = this.getFacetByFieldName(fieldName);
            if (facet != null) {
                if (facet['type'] == 'hierarchical') {
                    let facetResponse = this.getFacetResponse(fieldName);
                    if (typeof (facetResponse) != "undefined" && facetResponse !== null) {
                        return '';
                    }
                    let tree = this.buildTree(facetResponse.values);
                    tree = this.getSelectedTreeNode(tree);
                    let tem = tree['node'].stringValue;
                    let parts = tem.spit('/');
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
        }
        getPriceFieldName() {
            return this.priceFieldName;
        }
        getCategoriesKeyLabels() {
            let categoryValueArray = Array();
            let temp = this.getCategories();
            temp.forEach(function (v) {
                let label = this.getCategoryValueLabel(v);
                categoryValueArray[label] = v;
            });
            return categoryValueArray;
        }
        getCategoryIdsFromLevel(level) {
            let facetResponse = this.getFacetResponse(this.getCategoryFieldName());
            let ids = Array();
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
        }
        getCategoryFromLevel(level) {
            let facetResponse = this.getFacetResponse(this.getCategoryFieldName());
            let categories = Array();
            if (facetResponse !== null) {
                facetResponse.values.forEach(function (category) {
                    if (category.hierarchy.length == level + 2) {
                        categories.push(category.hierarchyId);
                    }
                });
            }
            return categories;
        }
        getSelectedCategoryIds() {
            let ids = Array();
            if (typeof (this.facets['category_id']) != "undefined" && this.facets['category_id'] !== null) {
                ids = this.facets['category_id']['selectedValues'];
            }
            return ids;
        }
        getCategories(ranking = 'alphabetical', minCategoryLevel = 0) {
            return this.getFacetValues(this.getCategoryFieldName(), ranking, minCategoryLevel);
        }
        getPriceRanges() {
            return this.getFacetValues(this.getPriceFieldName());
        }
        getFacetValues(fieldName, ranking = 'alphabetical', minCategoryLevel = 0) {
            this.lastSetMinCategoryLevel = minCategoryLevel;
            return this.Array_keys(this.getFacetKeysValues(fieldName, ranking, minCategoryLevel));
        }
        Array_keys(input) {
            let output = new Array();
            let counter = 0;
            for (let i in input) {
                output[counter++] = i;
            }
            return output;
        }
        getFacetValueArray(fieldName, facetValue) {
            let fv;
            let from;
            let to;
            let paramValue;
            let valueLabel;
            let hash = fieldName + ' - ' + facetValue;
            if (this.facetValueArrayCache[hash] != undefined && this.facetValueArrayCache[hash] !== null) {
                return this.facetValueArrayCache[hash];
            }
            let keyValues = this.getFacetKeysValues(fieldName, 'alphabetical', this.lastSetMinCategoryLevel);
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
                let facetResponse = this.getFacetResponse(this.getCategoryFieldName());
                if (facetResponse != null) {
                    facetResponse.values.forEach(function (bxFacet) {
                        if (bxFacet.hierarchyId == facetValue) {
                            keyValues[facetValue] = bxFacet;
                        }
                    });
                }
            }
            if (keyValues[facetValue] === null) {
                throw new Error("Requesting an invalid facet values for fieldname: " + fieldName + ", requested value: " + facetValue + ", available values . " + this.Array_keys(keyValues).join(','));
            }
            let type = this.getFacetType(fieldName);
            fv = (typeof (keyValues[facetValue]) != "undefined" && keyValues[facetValue] !== null) ? keyValues[facetValue] : null;
            let hidden = (typeof (fv.hidden) != "undefined" && fv.hidden !== null) ? fv.hidden : false;
            switch (type) {
                case 'hierarchical':
                    let temp = fv.stringValue;
                    let parts = temp.split("/");
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
        }
        getCategoryValueLabel(facetValue) {
            return this.getFacetValueLabel(this.getCategoryFieldName(), facetValue);
        }
        getSelectedPriceRange() {
            let valueLabel = null;
            if (this.selectedPriceValues !== null && (this.selectedPriceValues != null)) {
                let from = this.selectedPriceValues[0].rangeFromInclusive.round(2);
                let to = this.selectedPriceValues[0].rangeToExclusive;
                if (this.priceRangeMargin) {
                    to -= 0.01;
                }
                to = to.round(2);
                valueLabel = from + '-' + to;
            }
            return valueLabel;
        }
        getPriceValueLabel(facetValue) {
            return this.getFacetValueLabel(this.getPriceFieldName(), facetValue);
        }
        getFacetValueLabel(fieldName, facetValue) {
            let tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            let label = tempFacetVal[0];
            let parameterValue = tempFacetVal[1];
            let hitCount = tempFacetVal[2];
            let selected = tempFacetVal[3];
            return label;
        }
        getCategoryValueCount(facetValue) {
            return this.getFacetValueCount(this.getCategoryFieldName(), facetValue);
        }
        getPriceValueCount(facetValue) {
            return this.getFacetValueCount(this.getPriceFieldName(), facetValue);
        }
        getFacetValueCount(fieldName, facetValue) {
            let tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            let label = tempFacetVal[0];
            let parameterValue = tempFacetVal[1];
            let hitCount = tempFacetVal[2];
            let selected = tempFacetVal[3];
            return hitCount;
        }
        isFacetValueHidden(fieldName, facetValue) {
            let tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            let label = tempFacetVal[0];
            let parameterValue = tempFacetVal[1];
            let hitCount = tempFacetVal[2];
            let selected = tempFacetVal[3];
            let hidden = tempFacetVal[4];
            return hidden;
        }
        getCategoryValueId(facetValue) {
            return this.getFacetValueParameterValue(this.getCategoryFieldName(), facetValue);
        }
        getPriceValueParameterValue(facetValue) {
            return this.getFacetValueParameterValue(this.getPriceFieldName(), facetValue);
        }
        getFacetValueParameterValue(fieldName, facetValue) {
            let tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            let label = tempFacetVal[0];
            let parameterValue = tempFacetVal[1];
            let hitCount = tempFacetVal[2];
            let selected = tempFacetVal[3];
            return parameterValue;
        }
        isPriceValueSelected(facetValue) {
            return this.isFacetValueSelected(this.getPriceFieldName(), facetValue);
        }
        isFacetValueSelected(fieldName, facetValue) {
            let tempFacetVal = this.getFacetValueArray(fieldName, facetValue);
            let label = tempFacetVal[0];
            let parameterValue = tempFacetVal[1];
            let hitCount = tempFacetVal[2];
            let selected = tempFacetVal[3];
            return selected;
        }
        getFacetValueIcon(fieldName, facetValue, language = null, defaultValue = '') {
            facetValue = facetValue.toLowerCase();
            let iconMap = JSON.parse(this.getFacetExtraInfo(fieldName, 'iconMap'));
            iconMap.forEach(function (icon) {
                if (language && icon.language != language) {
                    return;
                }
                if (facetValue == icon.value.toLowerCase()) {
                    return icon.icon;
                }
            });
            return defaultValue;
        }
        getThriftFacets() {
            let thriftFacets = Array();
            for (let fieldName in this.facets) {
                let facet = this.facets[fieldName];
                let type = facet['type'];
                let order = facet['order'];
                let maxCount = facet['maxCount'];
                let andSelectedValues = facet['andSelectedValues'];
                if (fieldName == this.priceFieldName) {
                    this.selectedPriceValues = this.facetSelectedValue(fieldName, type);
                }
                let facetRequest = new thrift_types.FacetRequest();
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
        }
        facetSelectedValue(fieldName, option) {
            let selectedFacets = Array();
            if (this.facets[fieldName]['selectedValues'] != undefined && (this.facets[fieldName]['selectedValues']) !== null && (this.facets[fieldName]['selectedValues']).length > 0) {
                this.facets[fieldName]['selectedValues'].forEach(function (value) {
                    let selectedFacet = new thrift_types.FacetValue();
                    if (option == 'ranged') {
                        let rangedValue = value.split('-');
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
        }
        getParentId(fieldName, id) {
            let hierarchy = Array();
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
        }
    }
    exports.BxFacets = BxFacets;
});
//# sourceMappingURL=BxFacets.js.map