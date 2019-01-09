(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BxClient", "./BxAutocompleteRequest", "./BxAutocompleteResponse", "./BxChooseResponse", "./BxData", "./BxFacets", "./BxParametrizedRequest", "./BxFilter", "./BxRecommendationRequest", "./BxRequest", "./BxSortFields", "./BxSearchRequest", "./BxBatchClient", "./BxBatchRequest", "./BxBatchResponse"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./BxClient"));
    __export(require("./BxAutocompleteRequest"));
    __export(require("./BxAutocompleteResponse"));
    __export(require("./BxChooseResponse"));
    __export(require("./BxData"));
    __export(require("./BxFacets"));
    __export(require("./BxParametrizedRequest"));
    __export(require("./BxFilter"));
    __export(require("./BxRecommendationRequest"));
    __export(require("./BxRequest"));
    __export(require("./BxSortFields"));
    __export(require("./BxSearchRequest"));
    __export(require("./BxBatchClient"));
    __export(require("./BxBatchRequest"));
    __export(require("./BxBatchResponse"));
});
//# sourceMappingURL=index.js.map