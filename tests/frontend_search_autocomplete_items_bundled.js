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
        define(["require", "exports", "mocha", "assert", "../lib/boxalino/example/frontend_search_autocomplete_items_bundled"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    const assert = require("assert");
    const _frontendSearchAutocompleteItemsBundled = require("../lib/boxalino/example/frontend_search_autocomplete_items_bundled");
    describe("frontend_search_autocomplete_items_bundled", () => {
        let account = "boxalino_automated_tests2"; // your account name
        let password = "boxalino_automated_tests2"; // your account password
        let isDev = false;
        let bxHost = "cdn.bx-cloud.com";
        let queryTexts = ["whit", "yello"];
        let firstTextualSuggestions = ['ida workout parachute pant', 'jade yoga jacket', 'push it messenger bag'];
        let secondTextualSuggestions = ['argus all weather tank', 'jupiter all weather trainer', 'livingston all purpose tight'];
        it("test", () => __awaiter(this, void 0, void 0, function* () {
            let _frontendSearch = new _frontendSearchAutocompleteItemsBundled.frontend_search_autocomplete_items_bundled();
            //testing the result of the frontend search basic case
            yield _frontendSearch.frontend_search_autocomplete_items_bundled(account, password, isDev, bxHost, queryTexts);
            let _bxAutocompleteResponses = _frontendSearch.bxResponses;
            let _fieldNames = ['title'];
            assert.deepEqual(_bxAutocompleteResponses.length, 2);
            assert.deepEqual(Object.keys(_bxAutocompleteResponses[0].getTextualSuggestions()), firstTextualSuggestions);
            assert.deepEqual(Object.keys(_bxAutocompleteResponses[0].getBxSearchResponse().getHitFieldValues(_fieldNames)), ["115", "131", "227", "355", "611"]);
            assert.deepEqual(Object.keys(_bxAutocompleteResponses[1].getTextualSuggestions()), secondTextualSuggestions);
            assert.deepEqual(Object.keys(_bxAutocompleteResponses[1].getBxSearchResponse().getHitFieldValues(_fieldNames)), ["1545"]);
        })).timeout(5000);
    });
});
//# sourceMappingURL=frontend_search_autocomplete_items_bundled.js.map