import { BxChooseResponse } from "../BxChooseResponse";
export declare class frontend_search_request_context_parameters {
    account: string;
    password: string;
    domain: string;
    logs: string[];
    isDev: boolean;
    bxHost: string;
    host: string;
    bxResponse: BxChooseResponse;
    frontendSearchRequestContextParameter(account: string, password: string, isDev: boolean, host: string, queryText: string): Promise<void>;
}
