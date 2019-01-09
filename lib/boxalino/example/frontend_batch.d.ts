export declare class frontend_batch {
    account: string;
    password: string;
    domain: string;
    logs: string[];
    isDev: boolean;
    bxHost: string;
    host: string;
    language: string;
    hitCount: number;
    choice_id: string;
    profileIds: any;
    frontendBatch(account: string, password: string, isDev: boolean, host: string, queryText: string): Promise<void>;
}
