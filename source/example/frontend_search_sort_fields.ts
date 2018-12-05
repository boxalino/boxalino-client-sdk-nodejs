import * as bxClient from '../BxClient';
import * as bxSearchRequest from '../BxSearchRequest';
import {BxChooseResponse} from "../BxChooseResponse";
import * as bxFacet from "../BxFacets";
import * as bxFilter from "../BxFilter";

var request = require('request');

export class frontend_search_sort_fields {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: BxChooseResponse;


    public async frontendSearchSortFields(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let hitCount: number = 10; //a maximum number of search result to return in one page
            let sortField = "title"; //sort the search results by this field - IMPORTANT: you need to put "products_" as a prefix to your field name except for standard fields: "title", "body", "discountedPrice", "standardPrice"
            let sortDesc = true; //sort in an ascending / descending way

            //create search request
            let bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);

            //add a sort field in the provided direction
            bxRequest.addSortField(sortField, sortDesc);
            bxRequest.setReturnFields([sortField]);

            //add the request
            _bxClient.addRequest(bxRequest);
            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getResponse();


            let logs: string[] = Array();
            let entity: string = "";
            //loop on the search response hit field values and print them
            let hitFieldValues = this.bxResponse.getHitFieldValues([sortField]);

            for (let i in hitFieldValues) {
                let hitFields = hitFieldValues[i];
                entity = "<h3>" + i + "</h3>";
                for (let j in hitFields) {
                    let hitValues = hitFields[j];
                    entity += (j + ": " + (hitValues != null && hitValues.length > 0 ? hitValues.toString() : ""));
                }

                logs.push(entity);

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
