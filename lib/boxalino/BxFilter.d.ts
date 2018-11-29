export declare class BxFilter {
    protected fieldName: string;
    protected values: string[];
    protected negative: boolean;
    protected hierarchyId: any;
    protected hierarchy: any;
    protected rangeFrom: any;
    protected rangeTo: any;
    constructor(fieldName: string, values?: string[], negative?: boolean);
    getFieldName(): string;
    getValues(): string[];
    isNegative(): boolean;
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
