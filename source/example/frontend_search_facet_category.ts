import * as bxClient from '../BxClient';
import * as bxSearchRequest from '../BxSearchRequest';
import {BxChooseResponse} from "../BxChooseResponse";
import * as bxFacet from "../BxFacets";

var request = require('request');

export class frontend_search_facet_category {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: BxChooseResponse;

    public async frontendSearchFacetCategory(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let hitCount: number = 10; //a maximum number of search result to return in one page
            let facetField: string = "products_color";
            //create search request
            let bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);
            bxRequest.setReturnFields(Array(facetField));
            //add a facert
            let facets = new bxFacet.BxFacets();
            let selectedValue: any =null ;
            facets.addCategoryFacet(selectedValue);
            bxRequest.setFacets(facets);
            //add the request
            _bxClient.addRequest(bxRequest);
            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getResponse();

            facets = this.bxResponse.getFacets();
            let logs: string[] = Array();

            //show the category breadcrumbs
            let level:number = 0;
            logs.push("<a href=\"?\">home</a>");
            let parentCategories=facets.getParentCategories();
            for(let item in parentCategories)
            {
                let parentCateogory = parentCategories[item];
                logs.push(">> <a href=\"?bx_category_id=" + item + "\">" + parentCateogory + "</a>");
                level++;
            }
            logs.push(" ");
            //show the category facet values
            let categories=facets.getCategories();
            for(let value in categories)
            {
                let cateogory = categories[value];
                logs.push("<a href=\"?bx_category_id=" + facets.getCategoryValueId(cateogory) + "\">" + facets.getCategoryValueLabel(cateogory) + "</a> (" + facets.getCategoryValueCount(cateogory) + ")");

            }
            logs.push(" ");

            //loop on the search response hit ids and print them
            for (let i in this.bxResponse.getHitIds()) {
                let id = this.bxResponse.getHitIds()[i];
                logs.push("" + i + ": returned id " + id + "");
            }


            if (typeof (print) === "undefined" || print !== null || print) {
                console.log(logs.join("<br/>"));
            }
        } catch (e) {
            //be careful not to print the error message on your publish web-site as sensitive information like credentials might be indicated for debug purposes
            let exception: any = e;
            if (typeof (print) === "undefined" || print !== null || print) {
                console.log(exception);
            }
        }
    }
}
