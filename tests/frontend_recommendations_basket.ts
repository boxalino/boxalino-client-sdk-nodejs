import "mocha";
import * as assert from "assert";
import * as _frontendRecommendationsBasket from "../lib/boxalino/example/frontend_recommendations_basket";
describe("frontend_recommendations_similar", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    it("test", async () => {
        let _froentendSimilar =  new _frontendRecommendationsBasket.frontend_recommendations_basket();
        await _froentendSimilar.frontend_recommendations_basket(account, password, isDev, bxHost);
        let list = ['1', '2', '3','4','5','6','7','8','9','10'];
        assert.deepEqual(list,_froentendSimilar.bxResponse.getHitIds());
    });
});