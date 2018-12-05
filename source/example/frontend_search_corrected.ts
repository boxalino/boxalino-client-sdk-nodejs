import * as bxClient from '../BxClient';
import * as bxSearchRequest from '../BxSearchRequest';
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_search_corrected {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: BxChooseResponse;

    public async frontendSearchCorrected(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let hitCount: number = 10; //a maximum number of search result to return in one page
            let logs: string[] = Array();
            //create search request
            let bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);

            //add the request
            _bxClient.addRequest(bxRequest);
            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getResponse();

            //if the query is corrected, then print the corrrect query text
            if (this.bxResponse.areResultsCorrected())
            {
                logs.push("Corrected query " + queryText + " into " + this.bxResponse.getCorrectedQuery());
            }

            //loop on the search response hit ids and print them
            for (let i in this.bxResponse.getHitIds()) {
                let id = this.bxResponse.getHitIds()[i];
                logs.push("" + i + ": returned id " + id + "");
            }

            if((this.bxResponse.getHitIds()).length == 0) {
                logs.push("There are no corrected results. This might be normal, but it also might mean that the first execution of the corpus preparation was not done and published yet. Please refer to the example backend_data_init and make sure you have done the following steps at least once: 1) publish your data 2) run the prepareCorpus case 3) publish your data again");
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
