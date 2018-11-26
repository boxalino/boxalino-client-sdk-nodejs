import "mocha";
import * as assert from "assert";
import * as _frontendRecommendationsSimilar from "../dist/example/frontend_recommendations_similar";
describe("frontend_recommendations_similar", () => {
    let account: any = "boxalino_automated_tests2"; // your account name
    let password: any = "boxalino_automated_tests2"; // your account password
    let isDev: any = false;
    let bxHost: any = "cdn.bx-cloud.com";
    it("test", async () => {
        let _froentendSimilar =  new _frontendRecommendationsSimilar.frontend_recommendations_similar();
        await _froentendSimilar.frontendRecommendationsSimilar(account, password, isDev, bxHost);
        let list = ['1', '2', '3','4','5','6','7','8','9','10'];
        assert.deepEqual(list,_froentendSimilar.bxResponse.getHitIds());
    });
});