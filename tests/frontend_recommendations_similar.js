(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mocha", "assert", "../dist/example/frontend_recommendations_similar"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    var assert = require("assert");
    var _frontendRecommendationsSimilar = require("../dist/example/frontend_recommendations_similar");
    describe("frontend_recommendations_similar", function () {
        var account = "boxalino_automated_tests2"; // your account name
        var password = "boxalino_automated_tests2"; // your account password
        var isDev = false;
        var bxHost = "cdn.bx-cloud.com";
        it("test", function () {
            var response = new _frontendRecommendationsSimilar.frontend_recommendations_similar().frontendRecommendationsSimilar(account, password, isDev, bxHost);
            assert.ok(response);
            console.log("dsfds");
        });
    });
});
//# sourceMappingURL=frontend_recommendations_similar.js.map