import "mocha";
import * as assert from "assert";
import * as _frontendSearchRequestContextParameters from "../lib/boxalino/example/frontend_search_request_context_parameters";

describe("frontend_search_request_context_parameters", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchRequestContextParameters.frontend_search_request_context_parameters();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchRequestContextParameter(account, password, isDev, bxHost, queryText);

    }).timeout(5000);
});