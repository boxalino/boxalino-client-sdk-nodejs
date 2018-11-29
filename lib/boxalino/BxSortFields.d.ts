export declare class BxSortFields {
    private sorts;
    constructor(field?: null, reverse?: boolean);
    /**
     * field name od field to sort by (i.e. discountedPrice / title)
     * reverse true for ASC, false for DESC
     */
    push(field: any, reverse?: boolean): void;
    getSortFields(): any[];
    Array_keys(input: any): any[];
    isFieldReverse(field: string): boolean;
    getThriftSortFields(): any;
}
