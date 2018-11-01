declare let thrift_types: any;
declare class BxFilter {
    protected fieldName: any;
    protected values: any;
    protected negative: any;
    protected hierarchyId: any;
    protected hierarchy: any;
    protected rangeFrom: any;
    protected rangeTo: any;
    constructor(fieldName: any, values?: any, negative?: any);
    getFieldName(): any;
    getValues(): any;
    isNegative(): any;
    getHierarchyId(): any;
    setHierarchyId(hierarchyId: any): void;
    getHierarchy(): any;
    setHierarchy(hierarchy: any): void;
    getRangeFrom(): any;
    setRangeFrom(rangeFrom: any): void;
    getRangeTo(): any;
    setRangeTo(rangeTo: any): void;
    getThriftFilter(): any;
}
