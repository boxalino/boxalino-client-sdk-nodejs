import "mocha";
import * as assert from "assert";
import * as _frontendSearchFacet from "../lib/boxalino/example/frontend_search_facet_price";
import {BxFacets} from "../source/BxFacets";

describe("frontend_search_basic", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchFacet.frontend_search_facet_price();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchFacetPrice(account, password, isDev, bxHost, queryText);

        let princeRange:string[] =_frontendSearch.facets.getPriceRanges();
        assert.equal(princeRange[0], "22-84");
        let hitFieldValues = _frontendSearch.bxResponse.getHitFieldValues([_frontendSearch.facets.getPriceFieldName()]);

        for (let i in hitFieldValues) {
            let hitFields = hitFieldValues[i];
            assert.equal(Number(hitFields['discountedPrice'][0]) >22.0,true);
            assert.equal(Number(hitFields['discountedPrice'][0]) <= 84.0,true);

        }


    }).timeout(5000);
});