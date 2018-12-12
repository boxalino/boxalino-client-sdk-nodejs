import * as bxClient from '../BxClient';
import * as bxSearchRequest from '../BxSearchRequest';
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_search_2nd_page {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: BxChooseResponse;


    public async frontendSearch2ndPage(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            let hitCount: number = 5; //a maximum number of search result to return in one page
            let offset: number = 5; //the offset to start the page with (if = hitcount ==> page 2)


            //create search request
            let bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);

            //set an offset for the returned search results (start at position provided)
            bxRequest.setOffset(offset);

            //add the request
            _bxClient.addRequest(bxRequest);

            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getResponse();


            let logs: string[] = Array();

            //loop on the search response hit ids and print them
            if (this.bxResponse.getHitIds()) {
                let GetHitIds = this.bxResponse.getHitIds();
                if (GetHitIds != null) {
                    for (let i in GetHitIds) {
                        let ID = GetHitIds[i];
                        logs.push(i + " returned id: " + ID);
                    }
                }
                else {
                    //loop on the search response hit ids and print them
                    for (let i in this.bxResponse.getHitIds()) {
                        let id = this.bxResponse.getHitIds()[i];
                        logs.push("" + i + ": returned id " + id + "");
                    }
                }


                if (typeof (print) === "undefined" || print !== null || print) {
                    console.log(logs.join("<br/>"));
                }
            }
        }
        catch (e) {
            //be careful not to print the error message on your publish web-site as sensitive information like credentials might be indicated for debug purposes
            let exception: any = e;
            if (typeof (print) === "undefined" || print !== null || print) {
                console.log(exception);
            }
        }
    }
}
