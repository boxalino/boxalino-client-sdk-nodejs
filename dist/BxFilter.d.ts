declare let thrift_types: any;
declare class BxFilter {
    protected fieldName: string;
    protected values: string[];
    protected negative: boolean;
    protected hierarchyId: string;
    protected hierarchy: string;
    protected rangeFrom: string;
    protected rangeTo: string;
    constructor(fieldName: string, values?: string[], negative?: boolean);
    getFieldName(): string;
    getValues(): string[];
    isNegative(): boolean;
    getHierarchyId(): string;
    setHierarchyId(hierarchyId: string): void;
    getHierarchy(): string;
    setHierarchy(hierarchy: string): void;
    getRangeFrom(): string;
    setRangeFrom(rangeFrom: string): void;
    getRangeTo(): string;
    setRangeTo(rangeTo: string): void;
    getThriftFilter(): any;
}
