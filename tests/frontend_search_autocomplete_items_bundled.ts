import "mocha";
import * as assert from "assert";
import * as _frontendSearchAutocompleteItemsBundled from "../lib/boxalino/example/frontend_search_autocomplete_items_bundled";

describe("frontend_search_autocomplete_items_bundled", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryTexts: string[] = ["whit", "yello"];
    let firstTextualSuggestions = ['ida workout parachute pant', 'jade yoga jacket', 'push it messenger bag'];
    let secondTextualSuggestions = ['argus all weather tank', 'jupiter all weather trainer', 'livingston all purpose tight'];

    it("test", async () => {
        let _frontendSearch = new _frontendSearchAutocompleteItemsBundled.frontend_search_autocomplete_items_bundled();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontend_search_autocomplete_items_bundled(account, password, isDev, bxHost, queryTexts);

         let _bxAutocompleteResponses = _frontendSearch.bxResponses;
        let _fieldNames :string[] = ['title'];

        assert.deepEqual(_bxAutocompleteResponses.length, 2);

        assert.deepEqual(Object.keys(_bxAutocompleteResponses[0].getTextualSuggestions()), firstTextualSuggestions);

        assert.deepEqual(Object.keys(_bxAutocompleteResponses[0].getBxSearchResponse().getHitFieldValues(_fieldNames)), ["115", "131", "227", "355", "611"]);

        assert.deepEqual(Object.keys(_bxAutocompleteResponses[1].getTextualSuggestions()), secondTextualSuggestions);

        assert.deepEqual(Object.keys(_bxAutocompleteResponses[1].getBxSearchResponse().getHitFieldValues(_fieldNames)), ["1545"]);


    }).timeout(5000);
});