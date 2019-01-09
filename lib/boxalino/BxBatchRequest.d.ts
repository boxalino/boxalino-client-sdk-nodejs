import { BxRequest } from './BxRequest';
export declare class BxBatchRequest extends BxRequest {
    protected language: string;
    protected choiceId: string;
    protected max: number;
    protected min: number;
    protected profileIds: any;
    protected choiceInquiryList: any;
    protected isTest: boolean;
    protected isDev: boolean;
    protected requestContextParameters: any;
    protected profileContextList: any;
    protected sameInquiry: boolean;
    constructor(language: string, choiceId: string, max?: number, min?: number);
    getChoiceInquiryList(): any;
    getProfileContextList(setOfProfileIds?: any): any;
    getSimpleSearchQuery(): any;
    getRequestContext(id: any): any;
    createMainInquiry(): any;
    addProfileContext(id: any, requestContext?: any): any;
    addChoiceInquiry(newChoiceInquiry: any): any;
    setUseSameChoiceInquiry(sameInquiry: any): void;
    setProfileIds(ids: any): void;
    getProfileIds(): any;
    getContextItems(): any[];
    setRequestContextParameters(requestParams: any): void;
    setIsDev(dev: any): void;
}
