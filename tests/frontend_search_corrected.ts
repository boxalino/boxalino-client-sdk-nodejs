import "mocha";
import * as assert from "assert";
import * as _frontendSearchCorrected from "../lib/boxalino/example/frontend_search_corrected";

describe("frontend_search_corrected", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "womem";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchCorrected.frontend_search_corrected();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchCorrected(account, password, isDev, bxHost, queryText);

        assert.equal(_frontendSearch.bxResponse.areResultsCorrected(),true);
        let list = ['41', '1940', '1065', '1151', '1241', '1321', '1385', '1401', '1609', '1801'];
        assert.deepEqual(list, _frontendSearch.bxResponse.getHitIds());



    }).timeout(5000);
});