import { BxChooseResponse } from "../BxChooseResponse";
import { BxClient } from "../BxClient";
export declare class frontend_search_debug_request {
    account: string;
    password: string;
    domain: string;
    logs: string[];
    isDev: boolean;
    bxHost: string;
    host: string;
    bxResponse: BxChooseResponse;
    bxClient: BxClient;
    frontendSearchDebugRequest(account: string, password: string, isDev: boolean, host: string, queryText: string): Promise<void>;
}
