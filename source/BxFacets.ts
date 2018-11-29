let  thrift_types = require('./bxthrift/p13n_types');
export class BxFacets {
    public facets: any = Array();
    protected searchResult: any;
    protected selectedPriceValues: any;
    protected parameterPrefix: string = "";
    protected priceFieldName: string = 'discountedPrice';
    protected priceRangeMargin: boolean = false;
    protected notificationLog: any = Array();
    protected notificationMode: boolean = false;
    private facetKeyValuesCache: any = Array();
    private lastSetMinCategoryLevel: number = 0;
    private facetValueArrayCache: any = Array();
    private filters: any = Array();
    protected forceIncludedFacets: any;

    setNotificationMode(mode: boolean) {
        this.notificationMode = mode;
    }

    getNotificationMode() {
        return this.notificationMode;
    }

    addNotification(name: string, parameters: string) {
        if (this.notificationMode) {
            this.notificationLog.push({ 'name': name, 'parameters': parameters })
        }
    }

    getNotifications() {
        return this.notificationLog;
    }

    setSearchResults(searchResult: any) {
        this.searchResult = searchResult;
    }
    getCategoryFieldName() {
        return "categories";
    }

    getFilters() {
        return this.filters;
    }

    addCategoryFacet(selectedValue: string, order: number = 2, maxCount: number = -1,
        andSelectedValues: boolean = false, label: string) {
        if (selectedValue) {
            this.addFacet('category_id', selectedValue, 'hierarchical', null, 1, false, 1, andSelectedValues);
        }
        this.addFacet(this.getCategoryFieldName(), null, 'hierarchical', label, order, false, maxCount);
    }
    addPriceRangeFacet(selectedValue: string, order: number = 2, label: string = 'Price', fieldName: string = 'discountedPrice', maxCount: number = -1) {
        this.priceFieldName = fieldName;
        this.addRangedFacet(fieldName, selectedValue, label, order, true, maxCount);
    }

    addRangedFacet(fieldName: string, selectedValue: string, label: string, order: number = 2, boundsOnly: boolean = false, maxCount: number = -1) {
        this.addFacet(fieldName, selectedValue, 'ranged', label, order, boundsOnly, maxCount);
    }

    addFacet(fieldName: string, selectedValue: string | null, type: string = 'string', label: string | null, order: number = 2,
        boundsOnly: any = false, maxCount: any = -1, andSelectedValues: any = false) {
        let selectedValues: any = Array();
        if (selectedValue != null) {
            selectedValues = (Array.isArray(selectedValue)) ? selectedValue : [selectedValue];
        }

        this.facets[fieldName] = {
            'label': label, 'type': type, 'order': order, 'selectedValues': selectedValues,
            'boundsOnly': boundsOnly, 'maxCount': maxCount, 'andSelectedValues': andSelectedValues
        };
    }

    setParameterPrefix(parameterPrefix: string) {
        this.parameterPrefix = parameterPrefix;
    }

    protected isCategories(fieldName: any) {
        return fieldName.index(this.getCategoryFieldName()) != false
    }

    getFacetParameterName(fieldName: string) {
        let parameterName: string = fieldName;
        if (this.isCategories(fieldName)) {
            parameterName = 'category_id';
        }
        return this.parameterPrefix+parameterName;
    }

    getForceIncludedFieldNames(onlySelected: boolean = false) {
        let fieldNames: any = Array();
        if (this.forceIncludedFacets == null) {
            this.getFieldNames();
        }
        if (Array.isArray(this.forceIncludedFacets)) {
            if (onlySelected) {
                this.searchResult.facetResponses.forEach(function (facetResponse: any) {
                    if (typeof (this.forceIncludedFacets[facetResponse.fieldName]) != "undefined" && this.forceIncludedFacets[facetResponse.fieldName] !== null) {
                        this.facetResponses.values.forEach(function (value: any) {
                            if (value.selected) {
                                fieldNames[facetResponse.fieldName] = facetResponse.fieldName;
                                return fieldNames;
                            }
                        });
                    }
                });
            } else {
                fieldNames = this.forceIncludedFacets;
            }
        }
        return fieldNames;
    }
    getSelectedSemanticFilterValues(field: string) {
        let selectedValues: any = Array();
        let fieldNames: any = this.getFieldNames();
        fieldNames.forEach(function (fieldName: string) {
            if (fieldName == field) {
                this.getFacetResponse(fieldName).values.forEach(function (value: any) {
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
        let fieldNames: any = Array();
        if (this.searchResult && (this.facets.length) !== this.searchResult.facetResponses.length) {
            this.forceIncludedFacets = Array();
            this.searchResult.facetResponses.forEach(function (facetResponse: any) {
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
            let facetResponse: any = this.getFacetResponse(fieldName);

            if ((facetResponse != null) && ((facetResponse.values.length) > 0 || (facet['selectedValues'].length) > 0)) {
                fieldNames[fieldName] = { 'fieldName': fieldName, 'returnedOrder': fieldNames.length };
            }
        }
        fieldNames.sort(function (a: any, b: any) {
            let aValue = parseInt(this.getFacetExtraInfo(a['fieldName'], 'order', a['returnedOrder']));
            if (aValue == 0) {
                aValue = a['returnedOrder'];
            }
            let bValue = parseInt(this.getFacetExtraInfo(b['fieldName'], 'order', b['returnedOrder']));
            if (bValue == 0) {
                bValue = b['returnedOrder'];
            }
            if (aValue == bValue) return 0;
            return aValue > bValue ? 1 : -1;
        });
        return fieldNames.keys;
    }

    getDisplayFacets(display: string, ddefault: boolean = false) {
        let selectedFacets = Array();
        this.getFieldNames().forEach(function (fieldName: string) {
            if (this.getFacetDisplay(fieldName) == display || (this.getFacetDisplay(fieldName) == null && ddefault)) {
                selectedFacets.push(fieldName);
            }
        });
        return selectedFacets;
    }
    getFacetExtraInfoFacets(extraInfoKey: string, extraInfoValue: string, ddefault: boolean = false, returnHidden: boolean = false, withSoftFacets: boolean = false) {
        let selectedFacets = Array();
        this.getFieldNames().forEach(function (fieldName: any) {
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

    getLeftFacets(returnHidden: any = false) {
        let leftFacets = this.getFacetExtraInfoFacets('position', 'left', true, returnHidden);
        this.addNotification('getLeftFacets', JSON.stringify(Array(returnHidden, leftFacets)));
        return leftFacets;
    }
    getTopFacets(returnHidden: boolean = false) {
        return this.getFacetExtraInfoFacets('position', 'top', false, returnHidden);
    }
    getBottomFacets(returnHidden: boolean = false) {
        return this.getFacetExtraInfoFacets('position', 'bottom', false, returnHidden);
    }
    getRightFacets(returnHidden: boolean = false) {
        return this.getFacetExtraInfoFacets('position', 'right', false, returnHidden);
    }
    getCPOFinderFacets(returnHidden: boolean = false) {
        return this.getFacetExtraInfoFacets('finderFacet', 'true', false, returnHidden, true);
    }

    getFacetResponseExtraInfo(facetResponse: any, extraInfoKey: any, defaultExtraInfoValue: any = null) {
        if (facetResponse) {
            if (Array.isArray(facetResponse.extraInfo) && (facetResponse.extraInfo.length) > 0 && (typeof (facetResponse.extraInfo[extraInfoKey]) != "undefined" && facetResponse.extraInfo[extraInfoKey] !== null)) {
                return facetResponse.extraInfo[extraInfoKey];
            }
            return defaultExtraInfoValue;
        }
        return defaultExtraInfoValue;
    }
    getFacetResponseDisplay(facetResponse: any, defaultDisplay: string = 'expanded') {
        if (facetResponse) {
            if (facetResponse.display) {
                return facetResponse.display;
            }
            return defaultDisplay;
        }
        return defaultDisplay;
    }
    getAllFacetExtraInfo(fieldName: string) {
        let extraInfo = null;
        if (fieldName == this.getCategoryFieldName()) {
            fieldName = 'category_id';
        }
        try {
            let facetResponse: any = this.getFacetResponse(fieldName);
            if ((facetResponse != null) && (Array.isArray(facetResponse.extraInfo)) && (facetResponse.extraInfo.length) > 0) {
                return facetResponse.extraInfo;
            }
        } catch (ex) {
            return extraInfo;
        }
    }

    getFacetExtraInfo(fieldName: string, extraInfoKey: string, defaultExtraInfoValue: any = null) {
        if (fieldName == this.getCategoryFieldName()) {
            fieldName = 'category_id';
        }
        try {
            let extraInfo = this.getFacetResponseExtraInfo(this.getFacetResponse(fieldName), extraInfoKey, defaultExtraInfoValue);
            this.addNotification('getFacetResponseExtraInfo', JSON.stringify(Array(fieldName, extraInfoKey, defaultExtraInfoValue, extraInfo)));
            return extraInfo;
        } catch (ex) {
            this.addNotification('Exception - getFacetResponseExtraInfo', JSON.stringify(Array(fieldName, extraInfoKey, defaultExtraInfoValue)));
            return defaultExtraInfoValue;
        }
    }

    prettyPrintLabel(label: string, prettyPrint: boolean = false) {
        if (prettyPrint) {
            label = label.replace('_', ' ');
            label = label.replace('products', '');
            label = (label.charAt(0).toUpperCase());
        }
        return label;
    }
    getFacetLabel(fieldName: string, language: string | null, defaultValue: string | null, prettyPrint: boolean = false) {
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
            labels.forEach(function (label: any) {
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
    showFacetValueCounters(fieldName: string, defaultValue: boolean = true) {
        return this.getFacetExtraInfo(fieldName, "showCounter", defaultValue ? "true" : "false") != "false";
    }
    getFacetIcon(fieldName: string, defaultValue: string | null) {
        return this.getFacetExtraInfo(fieldName, "icon", defaultValue);
    }
    isFacetExpanded(fieldName: string, ddefault: boolean = true) {
        fieldName = fieldName == this.getCategoryFieldName() ? 'category_id' : fieldName;
        let defaultDisplay = ddefault ? 'expanded' : "";
        return this.getFacetDisplay(fieldName, defaultDisplay) == 'expanded';
    }
    getHideCoverageThreshold(fieldName: string, defaultHideCoverageThreshold = 0) {
        defaultHideCoverageThreshold = this.getFacetExtraInfo(fieldName, "minDisplayCoverage", defaultHideCoverageThreshold);
        return defaultHideCoverageThreshold;
    }
    getTotalHitCount() {
        return this.searchResult.totalHitCount;
    }
    getFacetCoverage(fieldName: string) {
        let coverage = 0;
        let temp: any = this.getFacetValues(fieldName);
        temp.forEach(function (facetValue: any) {
            coverage += this.getFacetValueCount(fieldName, facetValue);
        });
        return coverage;
    }
    isFacetHidden(fieldName: string, defaultHideCoverageThreshold: any = 0) {
        if (this.getFacetDisplay(fieldName) == 'hidden') {
            return true;
        }
        defaultHideCoverageThreshold = this.getHideCoverageThreshold(fieldName, defaultHideCoverageThreshold);
        if (defaultHideCoverageThreshold > 0 && (this.getSelectedValues(fieldName).length) == 0) {
            let ratio: any = this.getFacetCoverage(fieldName) / this.getTotalHitCount();
            return parseFloat(ratio) < parseFloat(defaultHideCoverageThreshold);
        }
        return false;
    }
    getFacetDisplay(fieldName: string, defaultDisplay: string = 'expanded') {
        if (fieldName == this.getCategoryFieldName()) {
            fieldName = 'category_id';
        }
        try {
            if (this.getFacetSelectedValues(fieldName).length > 0) {
                return 'expanded';
            }
            return this.getFacetResponseDisplay(this.getFacetResponse(fieldName), defaultDisplay);
        } catch (ex) {
            return defaultDisplay;
        }
    }
    protected getFacetResponse(fieldName: string) {
        if (this.searchResult != null && this.searchResult.facetResponses != null) {
            this.searchResult.facetResponses.forEach(function (facetResponse: any) {
                if (facetResponse.fieldName == fieldName) {
                    return facetResponse;
                }
            });
        }
        return null;
    }
    protected getFacetType(fieldName: string) {
        let type = 'string';
        if (typeof (this.facets[fieldName]) != "undefined" && this.facets[fieldName] !== null) {
            type = this.facets[fieldName]['type'];
        }
        return type;
    }
    protected buildTree(response: any, parents: any = Array(), parentLevel: number = 0) {
        if (parents.length == 0) {
            parents = Array();
            response.forEach(function (node: any) {
                if (node.hierarchy.length == 1) {
                    parents.push(node);
                }
            });
            if (parents.length == 1) {
                parents = parents[0].hierarchy;
            } else if (parents.length > 1) {
                let children: any = Array();
                let hitCountSum: any = 0;
                parents.forEach(function (parent: any) {
                    children.push(this.buildTree(response, parent.hierarchy, parentLevel));
                    hitCountSum += children[children.length - 1]['node'].hitCount;
                });
                let root: any = Array();
                root['stringValue'] = '0/Root';
                root['hitCount'] = hitCountSum;
                root['hierarchyId'] = 0;
                root['hierarchy'] = Array();
                root['selected'] = false;
                return { 'node': root, 'children': children };
            }
        }
        let children: any = Array();
        response.forEach(function (node: any) {
            if (node.hierarchy.length == parentLevel + 2) {
                let allTrue: any = true;
                for (let k in parents) {
                    let v = parents[k];
                    if ((typeof (node.hierarchy[k]) == "undefined" && node.hierarchy[k] === null) || node.hierarchy[k] != v) {
                        allTrue = false;
                    }
                }
                if (allTrue) {
                    children.pushthis.buildTree(response, node.hierarchy, parentLevel + 1);
                }
            }
        });
        response.forEach(function (node: any) {
            if (node.hierarchy.length == parentLevel + 1) {
                let allTrue: any = true;
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

    protected getFirstNodeWithSeveralChildren(tree: any, minCategoryLevel: number = 0) {
        if (tree == null) {
            return null;
        }
        if (tree['children'].length == 0) {
            return null;
        }
        if (tree['children'].length > 1 && minCategoryLevel <= 0) {
            return tree;
        }
        let bestTree: any = tree['children'][0];
        if (tree['children'].length > 1) {
            tree['children'].forEach(function (node: any) {
                if (node['node'].hitCount > bestTree['node'].hitCount) {
                    bestTree = node;
                }
            });
        }
        this.getFirstNodeWithSeveralChildren(bestTree, minCategoryLevel - 1);
    }

    getFacetSelectedValues(fieldName: string) {
        let selectedValues: any = Array();
        this.getFacetKeysValues(fieldName).forEach(function (val: any) {
            if ((typeof (val.stringValue) != "undefined" && val.stringValue !== null) && val.selected) {
                selectedValues.push(val.stringValue.toString());
            }
        });
        return selectedValues;
    }
    getSelectedTreeNode(tree: any) {
        let selectedCategoryId: any = null;
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
            } catch (ex) {
            }
        }
        if (selectedCategoryId == null) {
            return tree;
        }
        if (tree == null || tree['node'] == null) {
            return null;
        }
        let tempPart = tree['node'].stringValue
        let parts = tempPart.split('/')

        if (parts[0] == selectedCategoryId) {
            return tree;
        }
        tree['children'].forEach(function (node: any) {
            let result = this.getSelectedTreeNode(node);
            if (result != null) {
                return result;
            }
        });
        return null;
    }
    getCategoryById(categoryId: string) {
        let facetResponse: any = this.getFacetResponse(this.getCategoryFieldName());
        if (facetResponse != null) {
            if (facetResponse.values != null) {
                facetResponse.values.forEach(function (bxFacet: any) {
                    if (bxFacet.hierarchyId == categoryId) {
                        return categoryId;
                    }
                });
            }
        }
        return null;
    }

    protected getFacetKeysValues(fieldName: string, ranking: string = 'alphabetical', minCategoryLevel: number = 0) {
        if (this.facetKeyValuesCache != null) {
            if (typeof (this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel]) != "undefined" && (this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel]) !== null) {
                return this.facetKeyValuesCache[fieldName + '_' + minCategoryLevel];
            }
        }
        if (fieldName == "") {
            return Array();
        }
        if (fieldName == 'category_id') return Array();
        let facetValues: any = Array();
        let facetResponse: any = this.getFacetResponse(fieldName);
        if (facetResponse == null) {
            return Array();
        }
        let type = this.getFacetType(fieldName);
        switch (type) {
            case 'hierarchical':
                let tree = this.buildTree(facetResponse.values);
                tree = this.getSelectedTreeNode(tree);
                let node = this.getFirstNodeWithSeveralChildren(tree, minCategoryLevel);
                if (node && !node.empty && node != null && node['children'] != null) {
                    node['children'].forEach(function (node: any) {
                        facetValues[node['node'].stringValue] = node['node'];
                    });
                }
                break;
            case 'ranged':
                let displayRange = JSON.parse(this.getFacetExtraInfo(fieldName, 'bx_displayPriceRange'));
                facetResponse.values.forEach(function (facetValue: any) {
                    if (displayRange) {
                        facetValue.rangeFromInclusive = displayRange[0] !== null ? displayRange[0].toString() : facetValue.rangeFromInclusive.toString();
                        facetValue.rangeToExclusive = displayRange[1] != null ? displayRange[1].toString() : facetValue.rangeToExclusive.toString();
                    }
                    facetValues[facetValue.rangeFromInclusive + '-' + facetValue.rangeToExclusive] = facetValue
                });
                break;
            default:
                facetResponse.values.forEach(function (facetValue: any) {
                    facetValues[facetValue.stringValue] = facetValue;
                });
                if (Array.isArray(this.facets[fieldName]['selectedValues'])) {
                    this.facets[fieldName]['selectedValues'].forEach(function (value: any) {
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
            facetValues.sort(function (a: any, b: any) {
                if (a.hitCount > b.hitCount) {
                    return -1;
                } else if (b.hitCount > a.hitCount) {
                    return 1;
                }
                return 0;
            });
        }
        let displaySelectedValues = this.getFacetExtraInfo(fieldName, "displaySelectedValues");
        if (displaySelectedValues == "only") {
            let finalFacetValues: any = Array();
            for (let k in facetValues) {
                let v = facetValues[k];
                if (v.selected) {
                    finalFacetValues[k] = v;
                }
            }
            facetValues = (finalFacetValues == null) ? facetValues : finalFacetValues;
        }
        if (displaySelectedValues == "top") {
            let finalFacetValues: any = Array();
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
            let finalFacetValues: any = Array();
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
    protected applyDependencies(fieldName: string, values: any) {
        let dependencies = JSON.parse(this.getFacetExtraInfo(fieldName, "jsonDependencies"));
        if (dependencies != null && !dependencies.empty) {
            dependencies.forEach(function (dependency: any) {
                if (dependency['values'].empty) return true;
                if (dependency['conditions'].empty) {
                    let effect = dependency['effect'];
                    if (effect['hide'] == 'true') {
                        dependency['values'].forEach(function (value: any) {
                            if (typeof (values[value]) != "undefined" && values[value] !== null) {
                                // unset(values[value]);
                                let index = values.indexOf(value);
                                if (index > -1) {
                                    this.values.splice(value, 1);
                                }
                            }
                        });
                    } else if (effect['hide'] == '') {
                        let temp: any = Array();
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
                        temp = values[effect['order']] = temp
                        temp = values;
                        values = Array();
                        temp.forEach(function (value: any) {
                            values[value.stringValue] = value;
                        });
                    }
                }
            });
        }
        return values;
    }
    getSelectedValues(fieldName: any) {
        let selectedValues: any = Array();
        try {
            let temp: any = this.getFacetValues(fieldName);
            temp.forEach(function (key: any) {
                if (this.isFacetValueSelected(fieldName, key)) {
                    selectedValues.push(key);
                }
            });
        } catch (ex) {
            if (typeof (this.facets[fieldName]['selectedValues']) != "undefined"
                && this.facets[fieldName]['selectedValues'] !== null) {
                return this.facets[fieldName]['selectedValues'];
            }
        }
        return selectedValues;
    }
    protected getFacetByFieldName(fieldName: any) {
        for (let fn in this.facets) {
            let facet = this.facets[fn];
            if (fieldName == fn) {
                return facet;
            }

        }
        return null;
    }
    isSelected(fieldName: any, ignoreCategories: any = false) {
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
                let facetResponse: any = this.getFacetResponse(fieldName);
                if (facetResponse == null) {
                    return false;
                }
                let tree: any = this.buildTree(facetResponse.values);
                tree = this.getSelectedTreeNode(tree);
                return tree && tree['node'].hierarchy.length > 1;
            }
            return ((typeof (this.facets[fieldName]['selectedValues']) != "undefined"
                && this.facets[fieldName]['selectedValues'] !== null)
                && (this.facets[fieldName]['selectedValues'].length) > 0);
        }
        return false;
    }
    getTreeParent(tree: any, treeEnd: any) {
        tree['children'].forEach(function (child: any) {
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
        let facetResponse: any = this.getFacetResponse(fieldName);
        if (facetResponse == null) {
            return Array();
        }
        let tree: any = this.buildTree(facetResponse.values);
        let treeEnd: any = this.getSelectedTreeNode(tree);
        if ((treeEnd && treeEnd.empty) || treeEnd == null) {
            return Array();
        }
        if (treeEnd['node'].stringValue == tree['node'].stringValue) {
            return Array();
        }
        let parents: any = Array();
        let parent = treeEnd;
        while (parent) {
            let temp = parent['node'].stringValue
            let parts = temp.split('/')

            if (parts[0] != 0) {
                parents.push(Array(parts[0], parts[parts.length - 1]))
            }
            parent = this.getTreeParent(tree, parent);
        }
        // krsort(parents);
        parents.reverse();
        let final: any = Array();
        parents.forEach(function (v: any) {
            final[v[0]] = v[1];
        });
        return final;
    }

    getParentCategoriesHitCount(id: any) {
        let fieldName: any = this.getCategoryFieldName();
        let facetResponse: any = this.getFacetResponse(fieldName);
        if (facetResponse == null) {
            return 0;
        }
        let tree: any = this.buildTree(facetResponse.values);
        let treeEnd: any = this.getSelectedTreeNode(tree);
        if (treeEnd == null) {
            return tree['node'].hitCount;
        }
        if (treeEnd['node'].stringValue == tree['node'].stringValue) {
            return tree['node'].hitCount;
        }
        let parent: any = treeEnd;
        while (parent) {
            if (parent['node'].hierarchyId == id) {
                return parent['node'].hitCount;
            }
            parent = this.getTreeParent(tree, parent);
        }
        return 0;
    }
    getSelectedValueLabel(fieldName: any, index: any = 0) {
        if (fieldName == "") {
            return "";
        }
        let svs: any = this.getSelectedValues(fieldName);

        if (typeof (svs[index]) != "undefined" && svs[index] !== null) {
            return this.getFacetValueLabel(fieldName, svs[index]);
        }
        let facet: any = this.getFacetByFieldName(fieldName);
        if (facet != null) {
            if (facet['type'] == 'hierarchical') {
                let facetResponse: any = this.getFacetResponse(fieldName);

                if (typeof (facetResponse) != "undefined" && facetResponse !== null) {
                    return '';
                }
                let tree: any = this.buildTree(facetResponse.values);
                tree = this.getSelectedTreeNode(tree);
                let tem: any = tree['node'].stringValue;
                let parts: any = tem.spit('/')
                return parts[parts.length - 1]
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
        let categoryValueArray: any = Array();
        let temp: any = this.getCategories();
        temp.forEach(function (v: any) {
            let label = this.getCategoryValueLabel(v);
            categoryValueArray[label] = v;
        });
        return categoryValueArray;
    }
    getCategoryIdsFromLevel(level: any) {
        let facetResponse: any = this.getFacetResponse(this.getCategoryFieldName());
        let ids: any = Array();
        if (facetResponse !== null) {
            facetResponse.values.forEach(function (category: any) {
                if (category.hierarchy.length == level + 2) {
                    ids.push(category.hierarchyId);
                }
            });
            facetResponse.values.forEach(function (category: any) {
                if (category.hierarchy.length == level + 2) {
                    ids.push(category.hierarchyId);
                }
            });
        }
        return ids;
    }

    getCategoryFromLevel(level: any) {
        let facetResponse: any = this.getFacetResponse(this.getCategoryFieldName());
        let categories: any = Array();
        if (facetResponse !== null) {
            facetResponse.values.forEach(function (category: any) {
                if (category.hierarchy.length == level + 2) {
                    categories.push(category.hierarchyId);
                }
            });
        }
        return categories;
    }
    getSelectedCategoryIds() {
        let ids: any = Array();
        if (typeof (this.facets['category_id']) != "undefined" && this.facets['category_id'] !== null) {
            ids = this.facets['category_id']['selectedValues'];
        }
        return ids;
    }
    getCategories(ranking: any = 'alphabetical', minCategoryLevel: any = 0) {
        return this.getFacetValues(this.getCategoryFieldName(), ranking, minCategoryLevel);
    }
    getPriceRanges() {
        return this.getFacetValues(this.getPriceFieldName());
    }

    getFacetValues(fieldName: any, ranking: any = 'alphabetical', minCategoryLevel: any = 0) {
        this.lastSetMinCategoryLevel = minCategoryLevel;
        return this.Array_keys(this.getFacetKeysValues(fieldName, ranking, minCategoryLevel));
    }
    Array_keys(input: any) {
        let output = new Array();
        let counter = 0;
        for (let i in input) {
            output[counter++] = i;
        }
        return output;
    }

    protected getFacetValueArray(fieldName: any, facetValue: any) {
        let fv: any;
        let from:any;
        let to: any;
        let paramValue: any;
        let valueLabel: any ;
        let hash: any = fieldName + ' - ' + facetValue;

        if (typeof (this.facetValueArrayCache[hash]) != "undefined" && this.facetValueArrayCache[hash] !== null) {
            return this.facetValueArrayCache[hash];
        }
        let keyValues: any = this.getFacetKeysValues(fieldName, 'alphabetical', this.lastSetMinCategoryLevel);
        if ((fieldName == this.priceFieldName) && (this.selectedPriceValues != null)) {
            fv = keyValues;
            from = this.selectedPriceValues[0].rangeFromInclusive.round(2);
            to = this.selectedPriceValues[0].rangeToExclusive;
            if (this.priceRangeMargin) {
                to -= 0.01;
            }
            to = to.round(2);
            valueLabel = from + ' - ' + to;
            paramValue = from + ' - ' + to;
            this.facetValueArrayCache[hash] = Array(valueLabel, paramValue, fv.hitCount, true, false);
            return this.facetValueArrayCache[hash];
        }
        if (Array.isArray(facetValue)) {
            facetValue = facetValue;
        }
        if (keyValues[facetValue] == null && fieldName == this.getCategoryFieldName()) {
            let facetResponse: any = this.getFacetResponse(this.getCategoryFieldName());
            if (facetResponse != null) {
                facetResponse.values.forEach(function (bxFacet: any) {
                    if (bxFacet.hierarchyId == facetValue) {
                        keyValues[facetValue] = bxFacet;
                    }
                });
            }
        }

        if (keyValues[facetValue] === null) {
            throw new Error("Requesting an invalid facet values for fieldname: " + fieldName + ", requested value: " + facetValue + ", available values . " + this.Array_keys(keyValues).join(','));
        }
        let type: any = this.getFacetType(fieldName);
        fv = (typeof (keyValues[facetValue]) != "undefined" && keyValues[facetValue] !== null) ? keyValues[facetValue] : null;
        let hidden: any = (typeof (fv.hidden) != "undefined" && fv.hidden !== null) ? fv.hidden : false;
        switch (type) {
            case 'hierarchical':
                let temp: any = fv.stringValue
                let parts: any = temp.split("/")
                this.facetValueArrayCache[hash] = [parts[parts.length - 1], parts[0], fv.hitCount, fv.selected, hidden];
                return this.facetValueArrayCache[hash];

            case 'ranged':
                from = fv.rangeFromInclusive.round(2);
                to = fv.rangeToExclusive.round(2);
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
    getCategoryValueLabel(facetValue: any) {
        return this.getFacetValueLabel(this.getCategoryFieldName(), facetValue);
    }
    getSelectedPriceRange() {
        let valueLabel: any = null;
        if (this.selectedPriceValues !== null && (this.selectedPriceValues != null)) {
            let from: any = this.selectedPriceValues[0].rangeFromInclusive.round(2);
            let to: any = this.selectedPriceValues[0].rangeToExclusive;
            if (this.priceRangeMargin) {
                to -= 0.01;
            }
            to = to.round(2);
            valueLabel = from + '-' + to;
        }
        return valueLabel;
    }
    getPriceValueLabel(facetValue: any) {
        return this.getFacetValueLabel(this.getPriceFieldName(), facetValue);
    }
    getFacetValueLabel(fieldName: any, facetValue: any) {
        let tempFacetVal=this.getFacetValueArray(fieldName, facetValue);
        let label: any = tempFacetVal[0];
        let parameterValue: any = tempFacetVal[1];
        let hitCount: any = tempFacetVal[2];
        let selected: any = tempFacetVal[3];
        return label;
    }
    getCategoryValueCount(facetValue: any) {
        return this.getFacetValueCount(this.getCategoryFieldName(), facetValue);
    }
    getPriceValueCount(facetValue: any) {
        return this.getFacetValueCount(this.getPriceFieldName(), facetValue);
    }
    getFacetValueCount(fieldName: any, facetValue: any) {
        let tempFacetVal=this.getFacetValueArray(fieldName, facetValue);
        let label = tempFacetVal[0];
        let parameterValue = tempFacetVal[1];
        let hitCount = tempFacetVal[2];
        let selected = tempFacetVal[3];
        return hitCount;
    }
    isFacetValueHidden(fieldName: any, facetValue: any) {
        let tempFacetVal=this.getFacetValueArray(fieldName, facetValue);
        let label = tempFacetVal[0];
        let parameterValue = tempFacetVal[1];
        let hitCount = tempFacetVal[2];
        let selected = tempFacetVal[3];
        let hidden = tempFacetVal[4];
        return hidden;
    }
    getCategoryValueId(facetValue: any) {
        return this.getFacetValueParameterValue(this.getCategoryFieldName(), facetValue);
    }
    getPriceValueParameterValue(facetValue: any) {
        return this.getFacetValueParameterValue(this.getPriceFieldName(), facetValue);
    }
    getFacetValueParameterValue(fieldName: any, facetValue: any) {
        let tempFacetVal=this.getFacetValueArray(fieldName, facetValue);
        let label = tempFacetVal[0];
        let parameterValue = tempFacetVal[1];
        let hitCount = tempFacetVal[2];
        let selected = tempFacetVal[3];
        return parameterValue;
    }
    isPriceValueSelected(facetValue: any) {
        return this.isFacetValueSelected(this.getPriceFieldName(), facetValue);
    }
    isFacetValueSelected(fieldName: any, facetValue: any) {
        let tempFacetVal=this.getFacetValueArray(fieldName, facetValue);
        let label = tempFacetVal[0];
        let parameterValue = tempFacetVal[1];
        let hitCount = tempFacetVal[2];
        let selected = tempFacetVal[3];
        return selected;
    }
    getFacetValueIcon(fieldName: any, facetValue: any, language: any = null, defaultValue: any = '') {
        facetValue = facetValue.toLowerCase();
        let iconMap: any = JSON.parse(this.getFacetExtraInfo(fieldName, 'iconMap'));
        iconMap.forEach(function (icon: any) {
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
        let thriftFacets: any = Array();
        for (let fieldName in this.facets) {
            let facet: any = this.facets[fieldName];
            let type: any = facet['type'];
            let order: any = facet['order'];
            let maxCount: any = facet['maxCount'];
            let andSelectedValues: any = facet['andSelectedValues'];
            if (fieldName == this.priceFieldName) {
                this.selectedPriceValues = this.facetSelectedValue(fieldName, type);
            }
            let facetRequest: any = new thrift_types.FacetRequest();
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
    private facetSelectedValue(fieldName: any, option: any) {
        let selectedFacets: any = Array();
        if (typeof (this.facets[fieldName]['selectedValues']) != "undefined" && (this.facets[fieldName]['selectedValues']) !== null) {
            this.facets[fieldName]['selectedValues'].forEach(function (value: any) {
                let selectedFacet: any = new thrift_types.FacetValue();
                if (option == 'ranged') {
                    let rangedValue = value.split('-')
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
                } else {
                    selectedFacet.stringValue = value;
                }
                selectedFacets.push(selectedFacet);
            });
            return selectedFacets;
        }
        return;
    }
    getParentId(fieldName: any, id: any) {
        let hierarchy: any = Array();
        this.searchResult.facetResponses.forEach(function (response: any) {
            if (response.fieldName == fieldName) {
                response.values.forEach(function (item: any) {
                    if (item.hierarchyId == id) {
                        hierarchy = item.hierarchy;
                        if (hierarchy.count < 4) {
                            return 1;
                        }
                    }
                });
                response.values.forEach(function (item: any) {
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