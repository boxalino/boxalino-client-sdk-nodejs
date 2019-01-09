import { BxChooseResponse } from "../BxChooseResponse";
export declare class frontend_search_object {
    account: string;
    password: string;
    domain: string;
    logs: any;
    isDev: boolean;
    bxHost: string;
    host: string;
    language: string;
    hitCount: number;
    choice_id: string;
    queryText: string;
    selectedValue: any;
    profileIds: any;
    bxResponse: BxChooseResponse;
    frontendSearchObject(account: string, password: string, isDev: boolean, host: string): Promise<void>;
    render_facets_from_collection(collection: any, facets: any): any;
}
