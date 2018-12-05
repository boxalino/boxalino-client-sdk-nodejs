import "mocha";
import * as assert from "assert";
import * as _frontendSearchBasic from "../lib/boxalino/example/frontend_search_basic";

describe("frontend_search_basic", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchBasic.frontend_search_basic();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchBasic(account, password, isDev, bxHost, queryText);
        let list = ['41', '1940', '1065', '1151', '1241', '1321', '1385', '1401', '1609', '1801'];
        assert.deepEqual(list, _frontendSearch.bxResponse.getHitIds());


        //testing the result of the frontend search basic case with semantic filtering blue => products_color=Blue
        queryText = "blue";
        let _frontendSearch1 = new _frontendSearchBasic.frontend_search_basic();
        await _frontendSearch1.frontendSearchBasic(account, password, isDev, bxHost, queryText);
        assert.equal(_frontendSearch1.bxResponse.getTotalHitCount(), 79);


        //testing the result of the frontend search basic case with semantic filtering forcing zero results pink => products_color=Pink
        queryText = "pink";
        let _frontendSearch2 = new _frontendSearchBasic.frontend_search_basic();
        await _frontendSearch2.frontendSearchBasic(account, password, isDev, bxHost, queryText);
        assert.equal(_frontendSearch2.bxResponse.getTotalHitCount(), 8);


        //testing the result of the frontend search basic case with semantic filtering setting a filter on a specific product only if the search shows zero results (this one should not do it because workout shows results)
        queryText = "workout";
        let _frontendSearch3 = new _frontendSearchBasic.frontend_search_basic();
        await _frontendSearch3.frontendSearchBasic(account, password, isDev, bxHost, queryText);
        assert.equal(_frontendSearch3.bxResponse.getTotalHitCount(), 28);


        //testing the result of the frontend search basic case with semantic filtering setting a filter on a specific product only if the search shows zero results (this one should do it because workoutoup shows no results)
        queryText = "workoutoup";
        let _frontendSearch4 = new _frontendSearchBasic.frontend_search_basic();
        await _frontendSearch4.frontendSearchBasic(account, password, isDev, bxHost, queryText);
        assert.equal(_frontendSearch4.bxResponse.getTotalHitCount(), 0);
    }).timeout(5000);
});