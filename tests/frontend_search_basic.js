(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mocha", "assert", "../dist/example/frontend_search_basic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    var assert = require("assert");
    var _frontendSearchBasic = require("../dist/example/frontend_search_basic");
    describe("frontend_search_basic", function () {
        var account = "boxalino_automated_tests2"; // your account name
        var password = "boxalino_automated_tests2"; // your account password
        var isDev = false;
        var bxHost = "cdn.bx-cloud.com";
        it("test", function () {
            var response = new _frontendSearchBasic.frontend_search_basic().frontendSearchBasic(account, password, isDev, bxHost, "women");
            assert.ok(response);
            console.log("dsfds");
        });
    });
});
//# sourceMappingURL=frontend_search_basic.js.map