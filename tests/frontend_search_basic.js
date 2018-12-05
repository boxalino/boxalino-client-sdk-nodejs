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
        define(["require", "exports", "mocha", "assert", "../lib/boxalino/example/frontend_search_basic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    const assert = require("assert");
    const _frontendSearchBasic = require("../lib/boxalino/example/frontend_search_basic");
    describe("frontend_search_basic", () => {
        let account = "boxalino_automated_tests2"; // your account name
        let password = "boxalino_automated_tests2"; // your account password
        let isDev = false;
        let bxHost = "cdn.bx-cloud.com";
        let queryText = "women";
        it("test", () => __awaiter(this, void 0, void 0, function* () {
            let _frontendSearch = new _frontendSearchBasic.frontend_search_basic();
            //testing the result of the frontend search basic case
            yield _frontendSearch.frontendSearchBasic(account, password, isDev, bxHost, queryText);
            let list = ['41', '1940', '1065', '1151', '1241', '1321', '1385', '1401', '1609', '1801'];
            assert.deepEqual(list, _frontendSearch.bxResponse.getHitIds());
            //testing the result of the frontend search basic case with semantic filtering blue => products_color=Blue
            queryText = "blue";
            let _frontendSearch1 = new _frontendSearchBasic.frontend_search_basic();
            yield _frontendSearch1.frontendSearchBasic(account, password, isDev, bxHost, queryText);
            assert.equal(_frontendSearch1.bxResponse.getTotalHitCount(), 79);
            //testing the result of the frontend search basic case with semantic filtering forcing zero results pink => products_color=Pink
            queryText = "pink";
            let _frontendSearch2 = new _frontendSearchBasic.frontend_search_basic();
            yield _frontendSearch2.frontendSearchBasic(account, password, isDev, bxHost, queryText);
            assert.equal(_frontendSearch2.bxResponse.getTotalHitCount(), 8);
            //testing the result of the frontend search basic case with semantic filtering setting a filter on a specific product only if the search shows zero results (this one should not do it because workout shows results)
            queryText = "workout";
            let _frontendSearch3 = new _frontendSearchBasic.frontend_search_basic();
            yield _frontendSearch3.frontendSearchBasic(account, password, isDev, bxHost, queryText);
            assert.equal(_frontendSearch3.bxResponse.getTotalHitCount(), 28);
            //testing the result of the frontend search basic case with semantic filtering setting a filter on a specific product only if the search shows zero results (this one should do it because workoutoup shows no results)
            queryText = "workoutoup";
            let _frontendSearch4 = new _frontendSearchBasic.frontend_search_basic();
            yield _frontendSearch4.frontendSearchBasic(account, password, isDev, bxHost, queryText);
            assert.equal(_frontendSearch4.bxResponse.getTotalHitCount(), 0);
        })).timeout(5000);
    });
});
//# sourceMappingURL=frontend_search_basic.js.map