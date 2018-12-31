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
        define(["require", "exports", "mocha", "assert", "../lib/boxalino/example/frontend_search_corrected"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    const assert = require("assert");
    const _frontendSearchCorrected = require("../lib/boxalino/example/frontend_search_corrected");
    describe("frontend_search_corrected", () => {
        let account = "boxalino_automated_tests2"; // your account name
        let password = "boxalino_automated_tests2"; // your account password
        let isDev = false;
        let bxHost = "cdn.bx-cloud.com";
        let queryText = "womem";
        it("test", () => __awaiter(this, void 0, void 0, function* () {
            let _frontendSearch = new _frontendSearchCorrected.frontend_search_corrected();
            //testing the result of the frontend search basic case
            yield _frontendSearch.frontendSearchCorrected(account, password, isDev, bxHost, queryText);
            assert.equal(_frontendSearch.bxResponse.areResultsCorrected(), true);
            let list = ['41', '1940', '1065', '1151', '1241', '1321', '1385', '1401', '1609', '1801'];
            assert.deepEqual(list, _frontendSearch.bxResponse.getHitIds());
        })).timeout(5000);
    });
});
//# sourceMappingURL=frontend_search_corrected.js.map