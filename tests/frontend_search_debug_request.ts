import "mocha";
import * as assert from "assert";
import * as _frontendSearchDebugRequest from "../lib/boxalino/example/frontend_search_debug_request";
var thrift_types = require('../source/bxthrift/p13n_types.js');

describe("frontend_search_debug_request", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "womem";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchDebugRequest.frontend_search_debug_request();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchDebugRequest(account, password, isDev, bxHost, queryText);

        assert(typeof (_frontendSearch.bxClient.getThriftChoiceRequest()),new thrift_types.ChoiceRequest);



    }).timeout(5000);
});