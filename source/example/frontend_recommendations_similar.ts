import * as bxClient from '../BxClient';
import * as bxRecommendationRequest from '../BxRecommendationRequest';
import {BxChooseResponse} from "../BxChooseResponse";
var request = require('request');
export class frontend_recommendations_similar {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse :BxChooseResponse ;

    public async frontendRecommendationsSimilar(account: string, password: string, isDev: boolean, host: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {


            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);

            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)

            let choiceId: string = "similar"; //the recommendation choice id (standard choice ids are: "similar" => similar products on product detail page, "complementary" => complementary products on product detail page, "basket" => cross-selling recommendations on basket page, "search"=>search results, "home" => home page personalized suggestions, "category" => category page suggestions, "navigation" => navigation product listing pages suggestions)

            let itemFieldId: string = "id"; // the field you want to use to define the id of the product (normally id, but could also be a group id if you have a difference between group id and sku)

            let itemFieldIdValue: string = "1940"; //the product id the user is currently looking at

            let hitCount: number = 10; //a maximum number of search result to return in one page

            //create search request
            let bxRequest = new bxRecommendationRequest.BxRecommendationRequest(language, choiceId, hitCount);

            //indicate the product the user is looking at now (reference of what the recommendations need to be similar to)
            bxRequest.setProductContext(itemFieldId, itemFieldIdValue);
            //add the request
            _bxClient.addRequest(bxRequest);
            // console.log(JSON.stringify(_bxClient.getThriftChoiceRequest()));
            //console.log("=------------------=");
            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getResponse();
            //  console.log(JSON.parse(JSON.stringify(_bxClient.getThriftChoiceRequest())));
            //indicate the search made with the number of results found
            let logs: string[] = Array();

            //loop on the search response hit ids and print them
            for (let i in this.bxResponse.getHitIds()) {
                let id = this.bxResponse.getHitIds()[i];
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
