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
        define(["require", "exports", "mocha", "assert", "../lib/boxalino/example/frontend_recommendation_similar_complementary"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("mocha");
    const assert = require("assert");
    const _frontendRecommendationsSimilarComplementary = require("../lib/boxalino/example/frontend_recommendation_similar_complementary");
    describe("frontend_recommendations_similar_complementary", () => {
        let account = "boxalino_automated_tests2"; // your account name
        let password = "boxalino_automated_tests2"; // your account password
        let isDev = false;
        let bxHost = "cdn.bx-cloud.com";
        it("test", () => __awaiter(this, void 0, void 0, function* () {
            let _froentendSimilar = new _frontendRecommendationsSimilarComplementary.frontend_recommendations_similar_complementary();
            yield _froentendSimilar.frontendRecommendationsSimilarComplementary(account, password, isDev, bxHost);
            let similarIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            let complementaryIds = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
            assert.deepEqual(similarIds, _froentendSimilar.bxResponse.getHitIds(_froentendSimilar.choiceIdSimilar));
            assert.deepEqual(complementaryIds, _froentendSimilar.bxResponse.getHitIds(_froentendSimilar.choiceIdComplementary));
        })).timeout(5000);
    });
});
//# sourceMappingURL=frontend_recommendation_similar_complementary.js.map