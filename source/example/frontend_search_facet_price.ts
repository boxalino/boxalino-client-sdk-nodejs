import * as bxClient from '../BxClient';
import * as bxSearchRequest from '../BxSearchRequest';
import {BxChooseResponse} from "../BxChooseResponse";
import {BxFacets} from "../BxFacets";

var request = require('request');

export class frontend_search_facet_price {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: BxChooseResponse;
    public facets:any;



    public async frontendSearchFacetPrice(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let hitCount: number = 10; //a maximum number of search result to return in one page
            let facetField: string = "products_color";
            //create search request
            let bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);

            //add a facert
            this.facets = new BxFacets();
            let selectedValue: any =null ;
            this.facets.addPriceRangeFacet(selectedValue);
            bxRequest.setFacets(this.facets);



            bxRequest.setReturnFields([this.facets.getPriceFieldName()]);
            //add the request
            _bxClient.addRequest(bxRequest);
            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getResponse();

            this.facets = this.bxResponse.getFacets();
            let logs: string[] = Array();


            //show the category breadcrumbs
            let level:number = 0;
            let priceRanges=this.facets.getPriceRanges();
            for(let fieldValue in priceRanges)
            {
                let value=priceRanges[fieldValue];
                let range:string = "<a href=\"?bx_price=" + this.facets.getPriceValueParameterValue(value) + "\">" + this.facets.getPriceValueLabel(value) + "</a> (" + this.facets.getPriceValueCount(value) + ")";
                if (this.facets.isPriceValueSelected(value))
                {
                    range += "<a href=\"?\">[X]</a>";
                }
                logs.push(range);
            }

            //loop on the search response hit field values and print them
            let hitFieldValues = this.bxResponse.getHitFieldValues([this.facets.getPriceFieldName()]);

            for (let i in hitFieldValues) {
                let hitFields = hitFieldValues[i];
                logs.push("<h3>" + i + "</h3>");
                for (let j in hitFields) {
                    let hitValues = hitFields[j];
                    logs.push("Price : " + (hitValues != null && hitValues.length > 0 ? hitValues.toString() : ""));
                }

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
