import { BxRequest } from './BxRequest';
export declare class BxParametrizedRequest extends BxRequest {
    private bxReturnFields;
    private getItemFieldsCB;
    private requestParametersPrefix;
    private requestWeightedParametersPrefix;
    private requestFiltersPrefix;
    private requestFacetsPrefix;
    private requestSortFieldPrefix;
    private requestReturnFieldsName;
    private requestContextItemFieldName;
    private requestContextItemFieldValues;
    private callBackCache;
    protected requestParameterExclusionPatterns: any[];
    constructor(language: any, choiceId: any, max?: any, min?: any, bxReturnFields?: any, getItemFieldsCB?: any);
    setRequestParametersPrefix(requestParametersPrefix: any): void;
    getRequestParametersPrefix(): any;
    setRequestWeightedParametersPrefix(requestWeightedParametersPrefix: any): void;
    getRequestWeightedParametersPrefix(): any;
    setRequestFiltersPrefix(requestFiltersPrefix: any): void;
    getRequestFiltersPrefix(): any;
    setRequestFacetsPrefix(requestFacetsPrefix: any): void;
    getRequestFacetsPrefix(): any;
    setRequestSortFieldPrefix(requestSortFieldPrefix: any): void;
    getRequestSortFieldPrefix(): any;
    setRequestReturnFieldsName(requestReturnFieldsName: any): void;
    getRequestReturnFieldsName(): any;
    setRequestContextItemFieldName(requestContextItemFieldName: any): void;
    getRequestContextItemFieldName(): any;
    setRequestContextItemFieldValues(requestContextItemFieldValues: any): void;
    getRequestContextItemFieldValues(): any;
    getPrefixes(): any[];
    matchesPrefix(string: any, prefix: any, checkOtherPrefixes?: any): boolean;
    getPrefixedParameters(prefix: any, checkOtherPrefixes?: any): any;
    getContextItems(): any[];
    getRequestParameterExclusionPatterns(): any[];
    addRequestParameterExclusionPatterns(pattern: any): void;
    getRequestContextParameters(): any;
    getWeightedParameters(): any;
    getFilters(): any;
    getFacets(): any;
    getSortFields(): any;
    getReturnFields(): any;
    array_unique(value: any, index: any, self: any): boolean;
    getAllReturnFields(): any;
    retrieveFromCallBack(items: any, fields: any): any;
    retrieveHitFieldValues(item: any, field: any, items: any, fields: any): any;
    private unset;
}