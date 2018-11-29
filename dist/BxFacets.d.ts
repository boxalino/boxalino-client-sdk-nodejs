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
    setNotificationMode(mode: boolean): void;
    getNotificationMode(): boolean;
    addNotification(name: string, parameters: string): void;
    getNotifications(): any;
    setSearchResults(searchResult: any): void;
    getCategoryFieldName(): string;
    getFilters(): any;
    addCategoryFacet(selectedValue: string, order: number | undefined, maxCount: number | undefined, andSelectedValues: boolean | undefined, label: string): void;
    addPriceRangeFacet(selectedValue: string, order?: number, label?: string, fieldName?: string, maxCount?: number): void;
    addRangedFacet(fieldName: string, selectedValue: string, label: string, order?: number, boundsOnly?: boolean, maxCount?: number): void;
    addFacet(fieldName: string, selectedValue: string | null, type: string | undefined, label: string | null, order?: number, boundsOnly?: any, maxCount?: any, andSelectedValues?: any): void;
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
    getFacetResponseExtraInfo(facetResponse: any, extraInfoKey: any, defaultExtraInfoValue?: any): any;
    getFacetResponseDisplay(facetResponse: any, defaultDisplay?: string): any;
    getAllFacetExtraInfo(fieldName: string): any;
    getFacetExtraInfo(fieldName: string, extraInfoKey: string, defaultExtraInfoValue?: any): any;
    prettyPrintLabel(label: string, prettyPrint?: boolean): string;
    getFacetLabel(fieldName: string, language: string | null, defaultValue: string | null, prettyPrint?: boolean): string;
    showFacetValueCounters(fieldName: string, defaultValue?: boolean): boolean;
    getFacetIcon(fieldName: string, defaultValue: string | null): any;
    isFacetExpanded(fieldName: string, ddefault?: boolean): boolean;
    getHideCoverageThreshold(fieldName: string, defaultHideCoverageThreshold?: number): number;
    getTotalHitCount(): any;
    getFacetCoverage(fieldName: string): number;
    isFacetHidden(fieldName: string, defaultHideCoverageThreshold?: any): boolean;
    getFacetDisplay(fieldName: string, defaultDisplay?: string): any;
    protected getFacetResponse(fieldName: string): null;
    protected getFacetType(fieldName: string): string;
    protected buildTree(response: any, parents?: any, parentLevel?: number): {
        'node': any;
        'children': any;
    } | null;
    protected getFirstNodeWithSeveralChildren(tree: any, minCategoryLevel?: number): any;
    getFacetSelectedValues(fieldName: string): any;
    getSelectedTreeNode(tree: any): any;
    getCategoryById(categoryId: string): null;
    protected getFacetKeysValues(fieldName: string, ranking?: string, minCategoryLevel?: number): any;
    protected applyDependencies(fieldName: string, values: any): any;
    getSelectedValues(fieldName: any): any;
    protected getFacetByFieldName(fieldName: any): any;
    isSelected(fieldName: any, ignoreCategories?: any): boolean;
    getTreeParent(tree: any, treeEnd: any): null;
    getParentCategories(): any;
    getParentCategoriesHitCount(id: any): any;
    getSelectedValueLabel(fieldName: any, index?: any): any;
    getPriceFieldName(): string;
    getCategoriesKeyLabels(): any;
    getCategoryIdsFromLevel(level: any): any;
    getCategoryFromLevel(level: any): any;
    getSelectedCategoryIds(): any;
    getCategories(ranking?: any, minCategoryLevel?: any): any[];
    getPriceRanges(): any[];
    getFacetValues(fieldName: any, ranking?: any, minCategoryLevel?: any): any[];
    Array_keys(input: any): any[];
    protected getFacetValueArray(fieldName: any, facetValue: any): any;
    getCategoryValueLabel(facetValue: any): any;
    getSelectedPriceRange(): any;
    getPriceValueLabel(facetValue: any): any;
    getFacetValueLabel(fieldName: any, facetValue: any): any;
    getCategoryValueCount(facetValue: any): any;
    getPriceValueCount(facetValue: any): any;
    getFacetValueCount(fieldName: any, facetValue: any): any;
    isFacetValueHidden(fieldName: any, facetValue: any): any;
    getCategoryValueId(facetValue: any): any;
    getPriceValueParameterValue(facetValue: any): any;
    getFacetValueParameterValue(fieldName: any, facetValue: any): any;
    isPriceValueSelected(facetValue: any): any;
    isFacetValueSelected(fieldName: any, facetValue: any): any;
    getFacetValueIcon(fieldName: any, facetValue: any, language?: any, defaultValue?: any): any;
    getThriftFacets(): any;
    private facetSelectedValue;
    getParentId(fieldName: any, id: any): void;
}