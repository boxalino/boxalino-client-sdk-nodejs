import { BxChooseResponse } from "../BxChooseResponse";
export declare class frontend_recommendations_similar_complementary {
    account: string;
    password: string;
    domain: string;
    logs: string[];
    isDev: boolean;
    bxHost: string;
    host: string;
    bxResponse: BxChooseResponse;
    choiceIdSimilar: string;
    choiceIdComplementary: string;
    frontendRecommendationsSimilarComplementary(account: string, password: string, isDev: boolean, host: string): Promise<void>;
}
