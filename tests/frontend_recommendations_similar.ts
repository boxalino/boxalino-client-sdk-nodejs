import "mocha";
import * as assert from "assert";
import * as _frontendRecommendationsSimilar from "../dist/example/frontend_recommendations_similar";
describe("frontend_recommendations_similar", () => {
    let account: any = "boxalino_automated_tests2"; // your account name
    let password: any = "boxalino_automated_tests2"; // your account password
    let isDev: any = false;
    let bxHost: any = "cdn.bx-cloud.com";
    it("test", () => {
        let response = new _frontendRecommendationsSimilar.frontend_recommendations_similar().frontendRecommendationsSimilar(account, password, isDev, bxHost);
        assert.ok(response);
        console.log("dsfds")
    });
});