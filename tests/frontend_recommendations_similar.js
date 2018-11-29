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
        define(["require", "exports", "mocha", "assert", "../lib/boxalino/example/frontend_recommendations_similar"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    const assert = require("assert");
    const _frontendRecommendationsSimilar = require("../lib/boxalino/example/frontend_recommendations_similar");
    describe("frontend_recommendations_similar", () => {
        let account = "boxalino_automated_tests2"; // your account name
        let password = "boxalino_automated_tests2"; // your account password
        let isDev = false;
        let bxHost = "cdn.bx-cloud.com";
        it("test", () => __awaiter(this, void 0, void 0, function* () {
            let _froentendSimilar = new _frontendRecommendationsSimilar.frontend_recommendations_similar();
            yield _froentendSimilar.frontendRecommendationsSimilar(account, password, isDev, bxHost);
            let list = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            assert.deepEqual(list, _froentendSimilar.bxResponse.getHitIds());
        }));
    });
});
//# sourceMappingURL=frontend_recommendations_similar.js.map