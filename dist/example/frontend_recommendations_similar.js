(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../BxClient", "../BxRecommendationRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bxClient = require("../BxClient");
    var bxRecommendationRequest = require("../BxRecommendationRequest");
    var request = require('request');
    var frontend_recommendations_similar = /** @class */ (function () {
        function frontend_recommendations_similar() {
            this.account = "boxalino_automated_tests2"; // your account name
            this.password = "boxalino_automated_tests2"; // your account password
            this.domain = ""; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "cdn.bx-cloud.com";
            this.host = "";
        }
        frontend_recommendations_similar.prototype.frontendRecommendationsSimilar = function (account, password, isDev, host) {
            this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
            try {
                var _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
                var language = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
                var choiceId = "similar"; //the recommendation choice id (standard choice ids are: "similar" => similar products on product detail page, "complementary" => complementary products on product detail page, "basket" => cross-selling recommendations on basket page, "search"=>search results, "home" => home page personalized suggestions, "category" => category page suggestions, "navigation" => navigation product listing pages suggestions)
                var itemFieldId = "id"; // the field you want to use to define the id of the product (normally id, but could also be a group id if you have a difference between group id and sku)
                var itemFieldIdValue = "1940"; //the product id the user is currently looking at
                var hitCount = 10; //a maximum number of search result to return in one page
                //create search request
                var bxRequest = new bxRecommendationRequest.BxRecommendationRequest(language, choiceId, hitCount);
                //indicate the product the user is looking at now (reference of what the recommendations need to be similar to)
                bxRequest.setProductContext(itemFieldId, itemFieldIdValue);
                //add the request
                _bxClient.addRequest(bxRequest);
                // console.log(JSON.stringify(_bxClient.getThriftChoiceRequest()));
                //console.log("=------------------=");
                //make the query to Boxalino server and get back the response for all requests
                var bxResponse = _bxClient.getResponse();
                console.log(JSON.parse(JSON.stringify(_bxClient.getThriftChoiceRequest())));
                //indicate the search made with the number of results found
                var logs = Array();
                //loop on the search response hit ids and print them
                for (var i in bxResponse.getHitIds()) {
                    var id = bxResponse.getHitIds()[i];
                    logs.push("" + i + ": returned id " + id + "");
                }
                if (typeof (print) === "undefined" || print !== null || print) {
                    console.log(logs.join("<br/>"));
                }
            }
            catch (e) {
                //be careful not to print the error message on your publish web-site as sensitive information like credentials might be indicated for debug purposes
                var exception = e;
                if (typeof (print) === "undefined" || print !== null || print) {
                    console.log(exception);
                }
            }
        };
        return frontend_recommendations_similar;
    }());
    exports.frontend_recommendations_similar = frontend_recommendations_similar;
});
//# sourceMappingURL=frontend_recommendations_similar.js.map