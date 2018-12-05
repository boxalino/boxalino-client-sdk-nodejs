import "mocha";
import * as assert from "assert";
import * as _frontendSearchReturnFields from "../lib/boxalino/example/frontend_search_return_fields";

describe("frontend_search_basic", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchReturnFields.frontend_search_return_fields();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchReturnFields(account, password, isDev, bxHost, queryText);



    }).timeout(5000);
});