import * as bxClient from '../BxClient';
import * as bxAutoCompleteRequest from '../BxAutocompleteRequest';
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_search_autocomplete_items_bundled {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    //public bxResponse: any;
    public bxResponses: any[];


    public async frontend_search_autocomplete_items_bundled(account: string, password: string, isDev: boolean, host: string, queryTexts: string[]) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);

            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let textualSuggestionsHitCount: number = 10; //a maximum number of search result to return in one page
            var fieldNames :string[] = ['title'];
            //return the title for each item returned (globally and per textual suggestion) - IMPORTANT: you need to put "products_" as a prefix to your field name except for standard fields: "title", "body", "discountedPrice", "standardPrice"

            var bxRequests :any[] = [];
            var thisObj = this;
            queryTexts.forEach(function (queryText) {

                //create search request

                let bxRequest = new bxAutoCompleteRequest.BxAutocompleteRequest(language, queryText, textualSuggestionsHitCount);

                //N.B.: in case you would want to set a filter on a request and not another, you can simply do it by getting the searchchoicerequest with: $bxRequest->getBxSearchRequest() and adding a filter

                //set the fields to be returned for each item in the response

                bxRequest.getBxSearchRequest().setReturnFields(fieldNames);
                bxRequests.push(bxRequest);

            });


            //set the request
            _bxClient.setAutocompleteRequests(bxRequests);

            //make the query to Boxalino server and get back the response for all requests
            this.bxResponses = await _bxClient.getAutocompleteResponses();

            var i = -1;
            //this.logs: string[] = Array();

            this.bxResponses.forEach(function (bxAutocompleteResponse) {
                //loop on the search response hit ids and print them
                let queryText = queryTexts[++i];
                thisObj.logs.push("<h2>textual suggestions for "+queryText+":</h2>");

             //-------1   bxAutocompleteResponse.getTextualSuggestions().forEach( function (suggestion:any) {

                for(let suggestion in  bxAutocompleteResponse.getTextualSuggestions()) {

                    thisObj.logs.push("<div style=\"border:1px solid; padding:10px; margin:10px\">");
                    thisObj.logs.push("<h3>" + suggestion + "</b></h3>");

                    thisObj.logs.push("item suggestions for suggestion " + suggestion + ":");

                    //loop on the search response hit ids and print them


                    var hitFieldValues = bxAutocompleteResponse.getBxSearchResponse(suggestion).getHitFieldValues(fieldNames);

                   for(let fieldValueObj in hitFieldValues){

                       //fieldValueMap[fieldName].toString()

                       thisObj.logs.push("<div>" + fieldValueObj);
                       for (let fieldName in hitFieldValues[fieldValueObj]) {
                           let dynamicObj = hitFieldValues[fieldValueObj][fieldName];
                           thisObj.logs.push(" - "+fieldName+": " + dynamicObj.join(','));

                       }
                       thisObj.logs.push("</div>");
                   }

                    thisObj.logs.push("</div>");
                }
             //-----------------foreach1   });


                thisObj.logs.push("<h2>global item suggestions for "+queryText+":</h2>")

                //loop on the search response hit ids and print them


                var hitFieldValues1= bxAutocompleteResponse.getBxSearchResponse().getHitFieldValues(fieldNames);


                hitFieldValues1.forEach(function(fieldValueMap:any,id:any){
                    thisObj.logs.push("<div>"+id);
                    for(let fieldName in fieldValueMap){
                        // thisObj.logs.push(" - "+fieldName+": " + fieldValues.join(','));
                        thisObj.logs.push(" - "+fieldName+": " + fieldValueMap[fieldName].toString());
                    }
                    thisObj.logs.push("</div>");
                });

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
