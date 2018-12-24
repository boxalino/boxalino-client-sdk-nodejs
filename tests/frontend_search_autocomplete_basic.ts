import "mocha";
import * as assert from "assert";
import * as _frontendSearchAutocompleteBasic from "../lib/boxalino/example/frontend_search_autocomplete_basic";

describe("frontend_search_autocomplete_basic", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "whit";
    let textualSuggestions = ['ida workout parachute pant', 'jade yoga jacket', 'push it messenger bag'];
    it("test", async () => {
        let _frontendSearch = new _frontendSearchAutocompleteBasic.frontend_search_autocomplete_basic();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchAutocompleteBasic(account, password, isDev, bxHost, queryText);

        assert.deepEqual(Object.keys(_frontendSearch.bxResponse.getTextualSuggestions()), textualSuggestions);



    }).timeout(5000);
});