import "mocha";
import * as assert from "assert";
import * as _frontendSearchAutocompleteItems from "../lib/boxalino/example/frontend_search_autocomplete_property";

describe("frontend_search_autocomplete_property", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "a";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchAutocompleteItems.frontend_search_autocomplete_property();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchAutocompleteProperty(account, password, isDev, bxHost, queryText);



    }).timeout(5000);
});