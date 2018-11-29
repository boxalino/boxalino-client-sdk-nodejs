import * as bxClient from '../BxClient';
import * as bxSearchRequest from '../BxSearchRequest';
var request = require('request');
export class frontend_search_basic {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";

    public frontendSearchBasic(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let hitCount: number = 10; //a maximum number of search result to return in one page

            //create search request
            let bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);

            //add the request
            _bxClient.addRequest(bxRequest);
            //make the query to Boxalino server and get back the response for all requests
            let bxResponse: any = _bxClient.getResponse();

            //indicate the search made with the number of results found
            let logs: string[] = Array();
            logs.push("Results for query \"" + queryText + "\" (" + bxResponse.getTotalHitCount().toString() + "):");

            //loop on the search response hit ids and print them
            for (let i in bxResponse.getHitIds()) {
                let id = bxResponse.getHitIds()[i];
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
