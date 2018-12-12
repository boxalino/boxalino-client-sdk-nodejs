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
        define(["require", "exports", "mocha", "assert", "../lib/boxalino/example/frontend_search_facet_price"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    const assert = require("assert");
    const _frontendSearchFacet = require("../lib/boxalino/example/frontend_search_facet_price");
    describe("frontend_search_facet_price", () => {
        let account = "boxalino_automated_tests2"; // your account name
        let password = "boxalino_automated_tests2"; // your account password
        let isDev = false;
        let bxHost = "cdn.bx-cloud.com";
        let queryText = "women";
        it("test", () => __awaiter(this, void 0, void 0, function* () {
            let _frontendSearch = new _frontendSearchFacet.frontend_search_facet_price();
            //testing the result of the frontend search basic case
            yield _frontendSearch.frontendSearchFacetPrice(account, password, isDev, bxHost, queryText);
            let princeRange = _frontendSearch.facets.getPriceRanges();
            assert.equal(princeRange[0], "22-84");
            let hitFieldValues = _frontendSearch.bxResponse.getHitFieldValues([_frontendSearch.facets.getPriceFieldName()]);
            for (let i in hitFieldValues) {
                let hitFields = hitFieldValues[i];
                assert.equal(Number(hitFields['discountedPrice'][0]) > 22.0, true);
                assert.equal(Number(hitFields['discountedPrice'][0]) <= 84.0, true);
            }
        })).timeout(5000);
    });
});
//# sourceMappingURL=frontend_search_facet_price.js.map