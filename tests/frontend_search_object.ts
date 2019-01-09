import "mocha";
import * as assert from "assert";
import * as _frontendSearchObject from "../lib/boxalino/example/frontend_search_object";

describe("frontend_search_object", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let host: string = "mooris.ch";
    let bxHost: string = "cdn.bx-cloud.com";
    it("test", async () => {
        let _frontendBatchSearch = new _frontendSearchObject.frontend_search_object();
        //testing the result of the frontend search basic case
        await _frontendBatchSearch.frontendSearchObject(account, password, isDev, host);



    }).timeout(5000);
});