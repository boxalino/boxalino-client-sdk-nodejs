import * as bxClient from '../BxClient';
import * as bxRecommendationRequest from '../BxRecommendationRequest';
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_recommendations_similar_complementary {
    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "";
    public bxResponse: BxChooseResponse;
    public choiceIdSimilar: string;
    public choiceIdComplementary: string;

    public async frontendRecommendationsSimilarComplementary(account: string, password: string, isDev: boolean, host: string) {
        this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
        try {

            let _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
            let language: string = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
            this.choiceIdSimilar = "similar"; //the recommendation choice id (standard choice ids are: "similar" => similar products on product detail page, "complementary" => complementary products on product detail page, "basket" => cross-selling recommendations on basket page, "search"=>search results, "home" => home page personalized suggestions, "category" => category page suggestions, "navigation" => navigation product listing pages suggestions)
            this.choiceIdComplementary = "complementary";
            let itemFieldId: string = "id"; // the field you want to use to define the id of the product (normally id, but could also be a group id if you have a difference between group id and sku)
            let itemFieldIdValue: string = "1940"; //the product id the user is currently looking at
            let hitCount: number = 10; //a maximum number of search result to return in one page

            //create search request
            let bxRequestSimilar = new bxRecommendationRequest.BxRecommendationRequest(language, this.choiceIdSimilar, hitCount);

            //indicate the product the user is looking at now (reference of what the recommendations need to be similar to)
            bxRequestSimilar.setProductContext(itemFieldId, itemFieldIdValue);
            //add the request
            _bxClient.addRequest(bxRequestSimilar);

            //create search request
            let bxRequestcomplementary = new bxRecommendationRequest.BxRecommendationRequest(language, this.choiceIdComplementary, hitCount);

            //indicate the product the user is looking at now (reference of what the recommendations need to be similar to)
            bxRequestcomplementary.setProductContext(itemFieldId, itemFieldIdValue);
            //add the request
            _bxClient.addRequest(bxRequestcomplementary);


            //make the query to Boxalino server and get back the response for all requests
            this.bxResponse = await _bxClient.getResponse();

            //indicate the search made with the number of results found
            let logs: string[] = Array();
            logs.push("recommendations of similar items:");

            //loop on the search response hit ids and print them
            for (let i in this.bxResponse.getHitIds(this.choiceIdSimilar)) {
                let id = this.bxResponse.getHitIds(this.choiceIdSimilar)[i];
                logs.push("" + i + ": returned id " + id + "");
            }
            logs.push("");

            //retrieve the recommended responses object of the complementary request
            logs.push("recommendations of complementary items:");
            //loop on the search response hit ids and print them
            for (let i in this.bxResponse.getHitIds(this.choiceIdComplementary)) {
                let id = this.bxResponse.getHitIds(this.choiceIdComplementary)[i];
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
