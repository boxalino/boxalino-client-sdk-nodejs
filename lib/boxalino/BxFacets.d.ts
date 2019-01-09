export declare class BxFacets {
    facets: any;
    protected searchResult: any;
    protected selectedPriceValues: any;
    protected parameterPrefix: string;
    protected priceFieldName: string;
    protected priceRangeMargin: boolean;
    protected notificationLog: any;
    protected notificationMode: boolean;
    private facetKeyValuesCache;
    private lastSetMinCategoryLevel;
    private facetValueArrayCache;
    private filters;
    protected forceIncludedFacets: any;
    setNotificationMode(mode: any): void;
    getNotificationMode(): boolean;
    addNotification(name: string, parameters: any): void;
    getNotifications(): any;
    setSearchResults(searchResult: any): void;
    getCategoryFieldName(): string;
    getFilters(): any;
    addCategoryFacet(selectedValue?: any, order?: number, maxCount?: number, andSelectedValues?: boolean, label?: any): void;
    addPriceRangeFacet(selectedValue?: any, order?: number, label?: string, fieldName?: string, maxCount?: number): void;
    addRangedFacet(fieldName: string, selectedValue?: any, label?: any, order?: number, boundsOnly?: boolean, maxCount?: number): void;
    addFacet(fieldName: string, selectedValue?: any, type?: string, label?: any, order?: number, boundsOnly?: any, maxCount?: any, andSelectedValues?: any): void;
    setParameterPrefix(parameterPrefix: string): void;
    protected isCategories(fieldName: any): boolean;
    getFacetParameterName(fieldName: string): string;
    getForceIncludedFieldNames(onlySelected?: boolean): any;
    getSelectedSemanticFilterValues(field: string): any;
    getFieldNames(): any;
    getDisplayFacets(display: string, ddefault?: boolean): any[];
    getFacetExtraInfoFacets(extraInfoKey: string, extraInfoValue: string, ddefault?: boolean, returnHidden?: boolean, withSoftFacets?: boolean): any[];
    getLeftFacets(returnHidden?: any): any[];
    getTopFacets(returnHidden?: boolean): any[];
    getBottomFacets(returnHidden?: boolean): any[];
    getRightFacets(returnHidden?: boolean): any[];
    getCPOFinderFacets(returnHidden?: boolean): any[];
    getFacetResponseExtraInfo(facetResponse: any, extraInfoKey: string, defaultExtraInfoValue?: any): any;
    getFacetResponseDisplay(facetResponse: any, defaultDisplay?: string): any;
    getAllFacetExtraInfo(fieldName: string): any;
    getFacetExtraInfo(fieldName: string, extraInfoKey: string, defaultExtraInfoValue?: any): any;
    prettyPrintLabel(label: string, prettyPrint?: boolean): string;
    getFacetLabel(fieldName: string, language?: any, defaultValue?: any, prettyPrint?: boolean): string;
    showFacetValueCounters(fieldName: string, defaultValue?: boolean): boolean;
    getFacetIcon(fieldName: string, defaultValue?: any): any;
    isFacetExpanded(fieldName: string, ddefault?: boolean): boolean;
    getHideCoverageThreshold(fieldName: string, defaultHideCoverageThreshold?: number): number;
    getTotalHitCount(): any;
    getFacetCoverage(fieldName: string): number;
    isFacetHidden(fieldName: string, defaultHideCoverageThreshold?: number): boolean;
    getFacetDisplay(fieldName: string, defaultDisplay?: string): any;
    protected getFacetResponse(fieldName: string): any;
    protected getFacetType(fieldName: string): string;
    protected buildTree(response: any, parents?: any, parentLevel?: number): any;
    protected getFirstNodeWithSeveralChildren(tree: any, minCategoryLevel?: number): any;
    getFacetSelectedValues(fieldName: string): any;
    getSelectedTreeNode(tree: any): any;
    getCategoryById(categoryId: string): null;
    protected getFacetKeysValues(fieldName: string, ranking?: string, minCategoryLevel?: number): any;
    protected applyDependencies(fieldName: string, values: any): any;
    getSelectedValues(fieldName: string): any;
    protected getFacetByFieldName(fieldName: string): any;
    isSelected(fieldName: string, ignoreCategories?: boolean): boolean;
    getTreeParent(tree: any, treeEnd: any): null;
    getParentCategories(): any;
    getParentCategoriesHitCount(id: any): any;
    getSelectedValueLabel(fieldName: string, index?: number): any;
    getPriceFieldName(): string;
    getCategoriesKeyLabels(): any;
    getCategoryIdsFromLevel(level: any): any;
    getCategoryFromLevel(level: any): any;
    getSelectedCategoryIds(): any;
    getCategories(ranking?: any, minCategoryLevel?: any): any[];
    getPriceRanges(): any[];
    getFacetValues(fieldName: string, ranking?: string, minCategoryLevel?: number): any[];
    Array_keys(input: any): any[];
    protected getFacetValueArray(fieldName: string, facetValue: any): any;
    getCategoryValueLabel(facetValue: any): any;
    getSelectedPriceRange(): any;
    getPriceValueLabel(facetValue: any): any;
    getFacetValueLabel(fieldName: string, facetValue: any): any;
    getCategoryValueCount(facetValue: any): any;
    getPriceValueCount(facetValue: any): any;
    getFacetValueCount(fieldName: string, facetValue: any): any;
    isFacetValueHidden(fieldName: string, facetValue: any): any;
    getCategoryValueId(facetValue: any): any;
    getPriceValueParameterValue(facetValue: any): any;
    getFacetValueParameterValue(fieldName: string, facetValue: any): any;
    isPriceValueSelected(facetValue: any): any;
    isFacetValueSelected(fieldName: string, facetValue: any): any;
    getFacetValueIcon(fieldName: string, facetValue: any, language?: any, defaultValue?: string): string;
    getThriftFacets(): any;
    private facetSelectedValue;
    getParentId(fieldName: string, id: any): void;
    getFacetsAsObjectsCollection(language?: null): any;
    prepareFacetsByValueCorrelation(fieldName: string, facetValues: any, valueCorrelationField: any): any;
    prepareFacetsByIconMapExtra(facetValues: any, fieldName: string, language?: null, defaultValue?: string): any;
    prepareFacetsByEnumDisplaySizeExtra(fieldName: string, facetValues: any): any;
    prepareFacetsByDisplaySelectedValuesExtra(fieldName: string, facetValues: any): any;
    prepareFacetsValuesForDefaultType(facetResponse: any): any[];
    prepareFacetsValuesForRangedType(facetResponse: any): any;
    prepareFacetsValuesForHierarchicalType(facetResponse: any, minCategoryLevel: any): any;
}
