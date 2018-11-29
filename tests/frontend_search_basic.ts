import "mocha";
import * as assert from "assert";
import * as _frontendSearchBasic from "../lib/boxalino/example/frontend_search_basic";
describe("frontend_search_basic", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    it("test", () => {
        let response = new _frontendSearchBasic.frontend_search_basic().frontendSearchBasic(account, password, isDev, bxHost, "women");
        assert.ok(response);
        console.log("dsfds")
    });
});