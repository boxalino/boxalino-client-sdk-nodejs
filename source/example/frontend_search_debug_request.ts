import * as bxClient from '../BxClient';
import * as bxSearchRequest from '../BxSearchRequest';
import {BxChooseResponse} from "../BxChooseResponse";
import {BxClient} from "../BxClient";

var request = require('request');

export class frontend_search_debug_request {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: BxChooseResponse;
    public bxClient:BxClient;

    public async frontendSearchDebugRequest(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            this.bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let hitCount: number = 10; //a maximum number of search result to return in one page
            let logs: string[] = Array();
            //create search request
            let bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);

            //add the request
            this.bxClient.addRequest(bxRequest);
            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await this.bxClient.getResponse();


            if (typeof (print) === "undefined" || print !== null || print) {
                console.log(this.bxClient.getThriftChoiceRequest());
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
