import * as bxClient from '../BxClient';
import * as bxRecommendationRequest from '../BxRecommendationRequest';
var request = require('request');
export class frontend_recommendations_similar {
    public account: any = "boxalino_automated_tests2"; // your account name
    public password: any = "boxalino_automated_tests2"; // your account password
    public domain: any = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: any = Array(); //optional, just used here in example to collect logs
    public isDev: any = false;
    public bxHost: any = "cdn.bx-cloud.com";
    public host: any = "";

    public frontendRecommendationsSimilar(account: any, password: any, isDev: any, host: any) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {
            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);

            let language: any = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)

            let choiceId: any = "similar"; //the recommendation choice id (standard choice ids are: "similar" => similar products on product detail page, "complementary" => complementary products on product detail page, "basket" => cross-selling recommendations on basket page, "search"=>search results, "home" => home page personalized suggestions, "category" => category page suggestions, "navigation" => navigation product listing pages suggestions)

            let itemFieldId: any = "id"; // the field you want to use to define the id of the product (normally id, but could also be a group id if you have a difference between group id and sku)

            let itemFieldIdValue:any = "1940"; //the product id the user is currently looking at

            let hitCount: any = 10; //a maximum number of search result to return in one page

            //create search request
            let bxRequest = new bxRecommendationRequest.BxRecommendationRequest(language, choiceId, hitCount);

            //indicate the product the user is looking at now (reference of what the recommendations need to be similar to)
            bxRequest.setProductContext(itemFieldId, itemFieldIdValue);
            //add the request
            _bxClient.addRequest(bxRequest);
            // console.log(JSON.stringify(_bxClient.getThriftChoiceRequest()));
            //console.log("=------------------=");
            //make the query to Boxalino server and get back the response for all requests
            let bxResponse:any = _bxClient.getResponse();
            console.log(JSON.parse(JSON.stringify(_bxClient.getThriftChoiceRequest())));
            //indicate the search made with the number of results found
            let logs: any = Array();

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
