import "mocha";
import * as assert from "assert";
import * as _frontendSearchFacet from "../lib/boxalino/example/frontend_search_facet";

describe("frontend_search_basic", () => {
    let account: string = "boxalino_automated_tests2"; // your account name
    let password: string = "boxalino_automated_tests2"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "women";
    it("test", async () => {
        let _frontendSearch = new _frontendSearchFacet.frontend_search_facet();
        //testing the result of the frontend search basic case
        await _frontendSearch.frontendSearchFacet(account, password, isDev, bxHost, queryText);
        let _facetField:string = "products_color";
        let productColor:any=new Array();
        productColor["products_color"]=Array('Black' , 'Gray' , 'Yellow');

         assert.deepEqual( _frontendSearch.bxResponse.getHitFieldValues([_facetField])["41"] , productColor);
        productColor["products_color"]=Array('Gray', 'Orange', 'Yellow');
         assert.deepEqual( _frontendSearch.bxResponse.getHitFieldValues([_facetField])["1940"] , productColor);


    }).timeout(5000);
});