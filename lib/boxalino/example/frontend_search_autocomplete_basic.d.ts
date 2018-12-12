export declare class frontend_search_autocomplete_basic {
    account: string;
    password: string;
    domain: string;
    logs: string[];
    isDev: boolean;
    bxHost: string;
    host: string;
    bxResponse: any;
    frontendSearchAutocompleteBasic(account: string, password: string, isDev: boolean, host: string, queryText: string): Promise<void>;
}
