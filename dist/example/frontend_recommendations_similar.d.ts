import { BxChooseResponse } from "../BxChooseResponse";
export declare class frontend_recommendations_similar {
    account: string;
    password: string;
    domain: string;
    logs: string[];
    isDev: boolean;
    bxHost: string;
    host: string;
    bxResponse: BxChooseResponse;
    frontendRecommendationsSimilar(account: string, password: string, isDev: boolean, host: string): Promise<void>;
}
