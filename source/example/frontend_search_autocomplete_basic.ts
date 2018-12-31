import * as bxClient from '../BxClient';
import * as bxAutoCompleteRequest from '../BxAutocompleteRequest';
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_search_autocomplete_basic {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: any;


    public async frontendSearchAutocompleteBasic(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);

            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let textualSuggestionsHitCount: number = 10; //a maximum number of search result to return in one page


            //create search request
            let bxRequest = new bxAutoCompleteRequest.BxAutocompleteRequest(language, queryText, textualSuggestionsHitCount);

            //set the request
            _bxClient.setAutocompleteRequest(Array(bxRequest));

            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getAutocompleteResponse();


            let logs: string[] = Array();

            //loop on the search response hit ids and print them
            logs.push("textual suggestions for "+ queryText +":");
            for(let suggestion in this.bxResponse.getTextualSuggestions()) {
                logs.push(this.bxResponse.getTextualSuggestionHighlighted(suggestion));
            }

            //if(this.bxResponse.getTextualSuggestions().count() == 0) {
            if(Object.keys(this.bxResponse.getTextualSuggestions()).length== 0) {
               logs.push("There are no autocomplete textual suggestions. This might be normal, but it also might mean that the first execution of the autocomplete index preparation was not done and published yet. Please refer to the example backend_data_init and make sure you have done the following steps at least once: 1) publish your data 2) run the prepareAutocomplete case 3) publish your data again");
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
