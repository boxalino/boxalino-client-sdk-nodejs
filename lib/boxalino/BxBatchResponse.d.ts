export declare class BxBatchResponse {
    protected bxBatchRequests: any;
    protected response: any;
    protected profileItemsFromVariants: any;
    protected bxBatchProfileContextsIds: any;
    constructor(response: any, bxBatchProfileIds?: any, bxBatchRequests?: any);
    getBatchResponse(): any;
    getHitFieldValuesByProfileId(profileId: any): any;
    getHitFieldValueForProfileIds(): any;
    getHitValueByField(field: any): any[];
    getHitIds(field?: any): any;
}
