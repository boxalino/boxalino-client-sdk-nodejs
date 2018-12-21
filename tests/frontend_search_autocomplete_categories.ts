import "mocha";
import * as assert from "assert";
import * as _frontendSearchAutocompleteCategories from "../lib/boxalino/example/frontend_search_autocomplete_categories";

describe("frontend_search_autocomplete_categories", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "whit";
    let textualSuggestions = ['ida workout parachute pant', 'jade yoga jacket', 'push it messenger bag'];
    it("test", async () => {
        let _frontendSearch = new _frontendSearchAutocompleteCategories.frontend_search_autocomplete_categories();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontend_search_autocomplete_categories(account, password, isDev, bxHost, queryText);



    }).timeout(5000);
});