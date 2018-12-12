import "mocha";
import * as assert from "assert";
import * as _frontendSearch2ndPage from "../lib/boxalino/example/frontend_search_2nd_page";

describe("frontend_search_2nd_page", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "watch";
    it("test", async () => {
        let _frontendSearch = new _frontendSearch2ndPage.frontend_search_2nd_page();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearch2ndPage(account, password, isDev, bxHost, queryText);



    }).timeout(5000);
});