import "mocha";
import * as assert from "assert";
import * as _frontendSearchSubPhrase from "../lib/boxalino/example/frontend_search_sub_phrases";

describe("frontend_search_sub_phrases", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women pack";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchSubPhrase.frontend_search_sub_phrases();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchSubPhrases(account, password, isDev, bxHost, queryText);



    }).timeout(5000);
});