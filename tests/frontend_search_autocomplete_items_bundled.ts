import "mocha";
import * as assert from "assert";
import * as _frontendSearchAutocompleteItemsBundled from "../lib/boxalino/example/frontend_search_autocomplete_items_bundled";

describe("frontend_search_autocomplete_items_bundled", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryTexts: string[] = ["whit", "yello"];
    let textualSuggestions = ['ida workout parachute pant', 'jade yoga jacket', 'push it messenger bag'];
    it("test", async () => {
        let _frontendSearch = new _frontendSearchAutocompleteItemsBundled.frontend_search_autocomplete_items_bundled();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontend_search_autocomplete_items_bundled(account, password, isDev, bxHost, queryTexts);



    }).timeout(5000);
});