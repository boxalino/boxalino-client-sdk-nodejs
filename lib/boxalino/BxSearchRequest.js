var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BxRequest"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BxRequest_1 = require("./BxRequest");
    var BxSearchRequest = /** @class */ (function (_super) {
        __extends(BxSearchRequest, _super);
        function BxSearchRequest(language, queryText, max, choiceId) {
            if (max === void 0) { max = 10; }
            if (choiceId === void 0) { choiceId = null; }
            var _this = this;
            if (choiceId == null) {
                choiceId = 'search';
            }
            var _bxRequest = _this = _super.call(this, language, choiceId, max, 0) || this;
            _this.setQuerytext(queryText);
            return _this;
        }
        return BxSearchRequest;
    }(BxRequest_1.BxRequest));
    exports.BxSearchRequest = BxSearchRequest;
});
//# sourceMappingURL=BxSearchRequest.js.map