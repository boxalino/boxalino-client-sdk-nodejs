import * as bxClient from '../BxClient';
import * as bxAutoCompleteRequest from '../BxAutocompleteRequest';
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_search_autocomplete_property {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: any;


    public async frontendSearchAutocompleteProperty(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);

            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let textualSuggestionsHitCount: number = 10; //a maximum number of search result to return in one page

            var thisObj = this;

            let property = 'categories' //the properties to do a property autocomplete request on, be careful, except the standard "categories" which always work, but return values in an encoded way with the path ( "ID/root/level1/level2"), no other properties are available for autocomplete request on by default, to make a property "searcheable" as property, you must set the field parameter "propertyIndex" to "true"
            let propertyTotalHitCount = 5 //the maximum number of property values to return
            let propertyEvaluateCounters = true //should the count of results for each property value be calculated? if you do not need to retrieve the total count for each property value, please leave the 3rd parameter empty or set it to false, your query will go faster

            //create search request
            let bxRequest = new bxAutoCompleteRequest.BxAutocompleteRequest(language, queryText, textualSuggestionsHitCount);

            //indicate to the request a property index query is requested
            bxRequest.addPropertyQuery(property, propertyTotalHitCount, true)

            //set the request
            _bxClient.setAutocompleteRequest(Array(bxRequest));

            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getAutocompleteResponse();


            //loop on the search response hit ids and print them

            thisObj.logs.push("property suggestions for "+queryText+":<br>")

            this.bxResponse.getPropertyHitValues(property).forEach(function (hitValue:any) {
                let label = this.bxResponse.getPropertyHitValueLabel(property, hitValue);
                let totalHitCount = this.bxResponse.getPropertyHitValueTotalHitCount(property, hitValue);
                let result = "<b>"+hitValue+":</b><ul><li>label="+label+"</li> <li>totalHitCount="+totalHitCount+"</li></ul>";
                thisObj.logs.push(result);
            })

            if (typeof (print) === "undefined" || print !== null || print) {
                console.log(this.logs.join("<br/>"));
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
