var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mocha", "assert", "../lib/boxalino/example/frontend_search_facet"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    const assert = require("assert");
    const _frontendSearchFacet = require("../lib/boxalino/example/frontend_search_facet");
    describe("frontend_search_basic", () => {
        let account = "boxalino_automated_tests2"; // your account name
        let password = "boxalino_automated_tests2"; // your account password
        let isDev = false;
        let bxHost = "cdn.bx-cloud.com";
        let queryText = "women";
        it("test", () => __awaiter(this, void 0, void 0, function* () {
            let _frontendSearch = new _frontendSearchFacet.frontend_search_facet();
            //testing the result of the frontend search basic case
            yield _frontendSearch.frontendSearchFacet(account, password, isDev, bxHost, queryText);
            let _facetField = "products_color";
            let productColor = new Array();
            productColor["products_color"] = Array('Black', 'Gray', 'Yellow');
            assert.deepEqual(_frontendSearch.bxResponse.getHitFieldValues([_facetField])["41"], productColor);
            productColor["products_color"] = Array('Gray', 'Orange', 'Yellow');
            assert.deepEqual(_frontendSearch.bxResponse.getHitFieldValues([_facetField])["1940"], productColor);
        })).timeout(5000);
    });
});
//# sourceMappingURL=frontend_search_facet.js.map