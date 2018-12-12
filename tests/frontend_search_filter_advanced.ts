import "mocha";
import * as assert from "assert";
import * as _frontendSearchFilterAdvanced from "../lib/boxalino/example/frontend_search_filter_advanced";

describe("frontend_search_filter_advanced", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchFilterAdvanced.frontend_search_filter_advanced();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchFilterAdvanced(account, password, isDev, bxHost, queryText);
        let _fieldNames:string = "products_color";


        assert.equal(Object.keys(_frontendSearch.bxResponse.getHitFieldValues([_fieldNames])).length , 10);



    }).timeout(5000);
});