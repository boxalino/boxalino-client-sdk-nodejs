import * as bxRequestModule from "./BxRequest";
export declare class BxSearchRequest extends bxRequestModule.BxRequest {
    constructor(language: string, queryText: string, max?: number, choiceId?: string);
}
