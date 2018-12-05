import { BxChooseResponse } from "../BxChooseResponse";
export declare class frontend_search_facet {
    account: string;
    password: string;
    domain: string;
    logs: string[];
    isDev: boolean;
    bxHost: string;
    host: string;
    bxResponse: BxChooseResponse;
    frontendSearchFacet(account: string, password: string, isDev: boolean, host: string, queryText: string): Promise<void>;
}
