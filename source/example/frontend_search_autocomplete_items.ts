import * as bxClient from '../BxClient';
import * as bxAutoCompleteRequest from '../BxAutocompleteRequest';
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_search_autocomplete_items {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: any;


    public async frontendSearchAutocompleteItems(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);

            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let textualSuggestionsHitCount: number = 10; //a maximum number of search result to return in one page
            var fieldNames :string[] = ['title'];
            var thisObj = this;

            //return the title for each item returned (globally and per textual suggestion) - IMPORTANT: you need to put "products_" as a prefix to your field name except for standard fields: "title", "body", "discountedPrice", "standardPrice"

            //create search request
            let bxRequest = new bxAutoCompleteRequest.BxAutocompleteRequest(language, queryText, textualSuggestionsHitCount);

            //set the fields to be returned for each item in the response
            bxRequest.getBxSearchRequest().setReturnFields(fieldNames);

            //set the request
            _bxClient.setAutocompleteRequest(Array(bxRequest));

            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getAutocompleteResponse();

                //loop on the search response hit ids and print them
            this.logs.push("textual suggestions for "+queryText+":<br>");


            for(let suggestion in this.bxResponse.getTextualSuggestions()) {
                thisObj.logs.push("<div style=\"border:1px solid; padding:10px; margin:10px\">");
                thisObj.logs.push("<h3>"+suggestion+"</b></h3>");

                thisObj.logs.push("item suggestions for suggestion "+suggestion+":<br>");

                //loop on the search response hit ids and print them

                var hitFieldValues=this.bxResponse.getBxSearchResponse(suggestion).getHitFieldValues(fieldNames);

                hitFieldValues.forEach(function(fieldValueMap:any,id:any){
                    thisObj.logs.push("<div>"+id);
                    for(let fieldName in fieldValueMap){
                       // thisObj.logs.push(" - "+fieldName+": " + fieldValues.join(','));
                        thisObj.logs.push(" - "+fieldName+": " + fieldValueMap[fieldName].toString());
                    }
                    thisObj.logs.push("</div>");
                });

                thisObj.logs.push("</div>");
            }

            thisObj.logs.push("global item suggestions for "+queryText+":<br>")

                //loop on the search response hit ids and print them

            var hitFieldValues1=this.bxResponse.getBxSearchResponse().getHitFieldValues(fieldNames);


            hitFieldValues1.forEach(function(id:any,fieldValueMap:any){
                let item = id;

                for(let fieldName in fieldValueMap){
                    //thisObj.logs.push(" - "+fieldName+": " + fieldValueMap[fieldName].toString());
                    item = item + " - "+fieldName+": " + fieldValueMap[fieldName].toString() + "<br>";
                }
                thisObj.logs.push(item);
            });

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
