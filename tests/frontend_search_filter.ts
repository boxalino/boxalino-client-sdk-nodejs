import "mocha";
import * as assert from "assert";
import * as _frontendSearchFilter from "../lib/boxalino/example/frontend_search_filter";

describe("frontend_search_filter", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchFilter.frontend_search_filter();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchFilter(account, password, isDev, bxHost, queryText);
        let _fieldNames:string = "products_color";


        assert.equal(_frontendSearch.bxResponse.getHitIds().indexOf("41")<0,true);



    }).timeout(5000);
});