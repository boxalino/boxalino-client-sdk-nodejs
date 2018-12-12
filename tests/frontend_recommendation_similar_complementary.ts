import "mocha";
import * as assert from "assert";
import * as _frontendRecommendationsSimilarComplementary from "../lib/boxalino/example/frontend_recommendation_similar_complementary";
describe("frontend_recommendations_similar_complementary", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    it("test", async () => {
        let _froentendSimilar =  new _frontendRecommendationsSimilarComplementary.frontend_recommendations_similar_complementary();
        await _froentendSimilar.frontendRecommendationsSimilarComplementary(account, password, isDev, bxHost);
        let similarIds = ['1', '2', '3','4','5','6','7','8','9','10'];
        let complementaryIds = ['11', '12', '13','14','15','16','17','18','19','20'];
        assert.deepEqual(similarIds,_froentendSimilar.bxResponse.getHitIds(_froentendSimilar.choiceIdSimilar));
        assert.deepEqual(complementaryIds,_froentendSimilar.bxResponse.getHitIds(_froentendSimilar.choiceIdComplementary));
    }).timeout(5000);
});