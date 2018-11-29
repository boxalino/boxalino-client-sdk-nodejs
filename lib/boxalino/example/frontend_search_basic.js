(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../BxClient", "../BxSearchRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bxClient = require("../BxClient");
    var bxSearchRequest = require("../BxSearchRequest");
    var request = require('request');
    var frontend_search_basic = /** @class */ (function () {
        function frontend_search_basic() {
            this.account = "boxalino_automated_tests2"; // your account name
            this.password = "boxalino_automated_tests2"; // your account password
            this.domain = ""; // your web-site domain (e.g.: www.abc.com)
            this.logs = Array(); //optional, just used here in example to collect logs
            this.isDev = false;
            this.bxHost = "cdn.bx-cloud.com";
            this.host = "";
        }
        frontend_search_basic.prototype.frontendSearchBasic = function (account, password, isDev, host, queryText) {
            this.host = (typeof (host) != "undefined" && host !== null) ? host : "cdn.bx-cloud.com";
            try {
                var _bxClient = new bxClient.BxClient(account, password, this.domain, isDev, this.host, request);
                var language = "en"; // a valid language code (e.g.: "en", "fr", "de", "it", ...)
                var hitCount = 10; //a maximum number of search result to return in one page
                //create search request
                var bxRequest = new bxSearchRequest.BxSearchRequest(language, queryText, hitCount);
                //add the request
                _bxClient.addRequest(bxRequest);
                //make the query to Boxalino server and get back the response for all requests
                var bxResponse = _bxClient.getResponse();
                //indicate the search made with the number of results found
                var logs = Array();
                logs.push("Results for query \"" + queryText + "\" (" + bxResponse.getTotalHitCount().toString() + "):");
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
        return frontend_search_basic;
    }());
    exports.frontend_search_basic = frontend_search_basic;
});
//# sourceMappingURL=frontend_search_basic.js.map