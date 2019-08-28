var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BxBatchResponse"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BxBatchResponse_1 = require("./BxBatchResponse");
    var thrift_types = require('./bxthrift/p13n_types.js');
    var thrift_P13nService = require('./bxthrift/P13nService.js');
    var thrift = require('thrift');
    var btoa = require('btoa');
    var secureRandom = require('securerandom');
    var BxBatchClient = /** @class */ (function () {
        function BxBatchClient(account, password, domain, isDev, apiKey, apiSecret) {
            if (isDev === void 0) { isDev = false; }
            if (apiKey === void 0) { apiKey = null; }
            if (apiSecret === void 0) { apiSecret = null; }
            this.apiKey = null;
            this.apiSecret = null;
            this.schema = 'https';
            this.batchSize = 1000;
            this.notifications = [];
            this.requestContextParameters = [];
            this.batchChooseRequests = [];
            this.batchChooseRequest = [];
            this.isTest = null;
            this.batchChooseResponse = [];
            this.transport = null;
            this.batchRequest = [];
            this.account = account;
            this.password = password;
            this.domain = domain;
            this.isDev = isDev;
            this.apiKey = apiKey;
            this.apiSecret = apiSecret;
            this.host = "track.bx-cloud.com/track";
            this.uri = '/p13n.web/p13n';
            this.schema = 'https';
            this.batchSize = 1000;
            this.notifications = [];
            this.requestContextParameters = [];
            this.batchChooseRequests = [];
        }
        BxBatchClient.prototype.setRequest = function (request) {
            request.setDefaultIndexId(this.getAccount(this.isDev));
            request.setRequestContextParameters(this.requestContextParameters);
            request.setIsDev(this.isDev);
            this.batchRequest = request;
        };
        BxBatchClient.prototype.getBatchChooseResponse = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _batchChooseResponseSize, _a, bxBatchChooseResponse;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _batchChooseResponseSize = 0;
                            if (this.batchChooseResponse.length > 0) {
                                _batchChooseResponseSize = this.batchChooseResponse.variants.size;
                            }
                            if (!((this.batchChooseResponse == null || this.batchChooseResponse.length < 1) == true)) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this.batchChoose()];
                        case 1:
                            _a.batchChooseResponse = _b.sent();
                            _b.label = 2;
                        case 2:
                            bxBatchChooseResponse = new BxBatchResponse_1.BxBatchResponse(this.batchChooseResponse, this.batchRequest.getProfileIds());
                            return [2 /*return*/, bxBatchChooseResponse];
                    }
                });
            });
        };
        BxBatchClient.prototype.batchChoose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var TmpReturn, requests, variants_1, selectedVariants_1, batchChooseResponse_1, batchChooseResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            requests = this.getThriftBatchChoiceRequest();
                            if (Array.isArray(requests)) {
                                variants_1 = Array();
                                selectedVariants_1 = Array();
                                //it means that the batch size has been exceeded
                                requests.forEach(function (request) {
                                    var response = this.p13nBatch(request);
                                    response.variants.forEach(function (variant) {
                                        variants_1.push(variant);
                                    });
                                    response.selectedVariants.forEach(function (selectedVariant) {
                                        selectedVariants_1.push(selectedVariant);
                                    });
                                });
                                batchChooseResponse_1 = new thrift_types.BatchChoiceResponse([{ "variant": variants_1 }, { 'selectedVariants': selectedVariants_1 }]);
                                TmpReturn = batchChooseResponse_1;
                            }
                            return [4 /*yield*/, this.p13nBatch(requests)];
                        case 1:
                            batchChooseResponse = _a.sent();
                            TmpReturn = batchChooseResponse;
                            return [2 /*return*/, TmpReturn];
                    }
                });
            });
        };
        BxBatchClient.prototype.getThriftBatchChoiceRequest = function () {
            var TmpReturn;
            var requestProfiles = this.batchRequest.getProfileIds();
            if (requestProfiles.length > this.batchSize) {
                var tempArr_1 = Array();
                var i_1 = 1;
                var obj_1 = this;
                requestProfiles.forEach(function (groupProfileIds) {
                    tempArr_1.push(groupProfileIds);
                    if (i_1 % this.batchSize == 0) {
                        var request = obj_1.getBatchChooseRequest(obj_1.batchRequest, tempArr_1);
                        obj_1.addBatchChooseRequest(request);
                        tempArr_1.splice(0, requestProfiles.length);
                    }
                    if (requestProfiles.length == i_1 && i_1 % this.batchSize != 0) {
                        var request = obj_1.getBatchChooseRequest(obj_1.batchRequest, tempArr_1);
                        obj_1.addBatchChooseRequest(request);
                        tempArr_1.splice(0, requestProfiles.length);
                    }
                    i_1++;
                });
                TmpReturn = this.batchChooseRequests;
            }
            var batchChooseRequest = this.getBatchChooseRequest(this.batchRequest);
            TmpReturn = batchChooseRequest;
            return TmpReturn;
        };
        BxBatchClient.prototype.addBatchChooseRequest = function (request) {
            if (this.batchChooseRequests == null || this.batchChooseRequests.length < 1) {
                this.batchChooseRequests = Array();
            }
            this.batchChooseRequests.push(request);
        };
        BxBatchClient.prototype.getBatchChooseRequest = function (request, profileIds) {
            if (profileIds === void 0) { profileIds = []; }
            var batchRequest = new thrift_types.BatchChoiceRequest();
            batchRequest.userRecord = this.getUserRecord();
            batchRequest.profileIds = [this.getAccount()];
            batchRequest.choiceInquiry = new thrift_types.ChoiceInquiry();
            batchRequest.requestContext = new thrift_types.RequestContext();
            batchRequest.profileContexts = request.getProfileContextList(profileIds);
            batchRequest.choiceInquiries = request.getChoiceInquiryList();
            return batchRequest;
        };
        BxBatchClient.prototype.p13nBatch = function (batchChoiceRequest) {
            return __awaiter(this, void 0, void 0, function () {
                var p1n, batchChooseResponse, debug_1, obj_2, debugOutput, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getP13n()];
                        case 1:
                            p1n = _a.sent();
                            batchChooseResponse = p1n.batchChoose(batchChoiceRequest);
                            if (this.requestContextParameters != null) {
                                if ((typeof (this.requestContextParameters['dev_bx_disp']) != "undefined" && this.requestContextParameters['dev_bx_disp'] !== null) && this.requestContextParameters['dev_bx_disp'] == 'true') {
                                    debug_1 = true;
                                    if ((typeof (this.requestContextParameters['dev_bx_choice']) != "undefined" && this.requestContextParameters['dev_bx_choice'] !== null)) {
                                        debug_1 = false;
                                        obj_2 = this;
                                        batchChoiceRequest.inquiries.forEach(function (inquiry) {
                                            if (inquiry.choiceId == obj_2.requestContextParameters['dev_bx_choice']) {
                                                debug_1 = true;
                                                return;
                                            }
                                        });
                                    }
                                    if (debug_1) {
                                        debugOutput = "<pre><h1>Choice Request</h1>" + batchChoiceRequest.toString() + "<br><h1>Choice Response</h1>" + batchChooseResponse.toString() + "</pre>";
                                        console.log(debugOutput);
                                        return [2 /*return*/];
                                    }
                                }
                                if ((typeof (this.requestContextParameters['dev_bx_debug']) != "undefined" && this.requestContextParameters['dev_bx_debug'] !== null) && this.requestContextParameters['dev_bx_debug'] == 'true') {
                                    this.addNotification('bxRequest', batchChoiceRequest);
                                    this.addNotification('bxResponse', batchChooseResponse);
                                }
                            }
                            return [2 /*return*/, batchChooseResponse];
                        case 2:
                            e_1 = _a.sent();
                            this.throwCorrectP13nException(e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BxBatchClient.prototype.getP13n = function () {
            if (this.transport == null) {
                if (this.apiKey == null || this.apiSecret == null) {
                    this.host = "api.bx-cloud.com";
                    this.apiKey = "boxalino";
                    this.apiSecret = "tkZ8EXfzeZc6SdXZntCU";
                }
            }
            var connection = thrift.createHttpConnection(this.host, "443", {
                transport: thrift.TBufferedTransport,
                protocol: thrift.TCompactProtocol,
                path: this.uri,
                https: true,
                headers: {
                    "Accept": "application/x-thrift",
                    "Content-Type": "application/x-thrift",
                    "Authorization": "Basic " + btoa(this.apiKey + ":" + this.apiSecret)
                },
            });
            var client = new thrift.createHttpClient(thrift_P13nService, connection);
            return client;
        };
        BxBatchClient.prototype.getUserRecord = function () {
            var userRecord = new thrift_types.UserRecord();
            userRecord.username = this.getAccount(this.isDev);
            userRecord.apiKey = this.getApiKey();
            userRecord.apiSecret = this.getApiSecret();
            return userRecord;
        };
        BxBatchClient.prototype.resetBatchRequests = function () {
            this.batchChooseRequests = Array();
        };
        BxBatchClient.prototype.flushResponses = function () {
            this.batchChooseResponse = null;
        };
        //duplicate from BxClient.rb
        BxBatchClient.prototype.throwCorrectP13nException = function (e) {
            var pieces;
            if (e.toString().indexOf('Could not connect ') !== false) {
                throw new Error('The connection to our server failed even before checking your credentials. This might be typically caused by 2 possible things: wrong values in host, port, schema or uri (typical value should be host=cdn.bx-cloud.com, port=443, uri =/p13n.web/p13n and schema=https, your values are : host=' + this.host + ', port=' + this.port + ', schema=' + this.schema + ', uri=' + this.uri + '). Another possibility, is that your server environment has a problem with ssl certificate (peer certificate cannot be authenticated with given ca certificates), which you can either fix, or avoid the problem by adding the line "curl_setopt(self::curlHandle, CURLOPT_SSL_VERIFYPEER, false);" in the file "lib\Thrift\Transport\P13nTCurlClient" after the call to curl_init in the function flush. Full error message=' + e.message);
            }
            if (e.toString().indexOf('Bad protocol id in TCompact message') !== false) {
                throw new Error('The connection to our server has worked, but your credentials were refused. Provided credentials username=' + this.p13n_username + ', password=' + this.p13n_password + '. Full error message=' + e.message);
            }
            if (e.toString().indexOf('choice not found') !== false) {
                var parts = e.message.split('choice not found');
                pieces = parts[1].split('	at ');
                var choiceId = pieces[0].trim().replace(':', '');
                throw new Error("Configuration not live on account " + this.getAccount() + ": choice " + choiceId + " doesn't exist. NB: If you get a message indicating that the choice doesn't exist, go to http://intelligence.bx-cloud.com, log in your account and make sure that the choice id you want to use is published.");
            }
            if (e.toString().indexOf('Solr returned status 404') !== false) {
                throw new Error("Data not live on account " + this.getAccount() + ": index returns status 404. Please publish your data first, like in example backend_data_basic.php.");
            }
            if (e.toString().indexOf('undefined field') !== false) {
                var parts = e.message.split('undefined field');
                pieces = parts[1].split('	at ');
                var field = pieces[0].replace(':', '');
                throw new Error("You request in your filter or facets a non-existing field of your account " + this.getAccount() + ": field " + field + " doesn't exist.");
            }
            if (e.toString().indexOf('All choice variants are excluded') !== false) {
                throw new Error("You have an invalid configuration for with a choice defined, but having no defined strategies. This is a quite unusual case, please contact support@boxalino.com to get support.");
            }
            throw e;
        };
        BxBatchClient.prototype.addRequestContextParameter = function (name, values) {
            if (!Array.isArray(values)) {
                values = Array([values]);
            }
            this.requestContextParameters[name] = values;
        };
        BxBatchClient.prototype.resetRequestContextParameter = function () {
            this.requestContextParameters = Array();
        };
        BxBatchClient.prototype.setTimeout = function (timeout) {
            this._timeout = timeout;
        };
        BxBatchClient.prototype.setHost = function (host) {
            this.host = host;
        };
        BxBatchClient.prototype.setTestMode = function (isTest) {
            this.isTest = isTest;
        };
        BxBatchClient.prototype.setApiKey = function (apiKey) {
            this.apiKey = apiKey;
        };
        BxBatchClient.prototype.setApiSecret = function (apiSecret) {
            this.apiSecret = apiSecret;
        };
        BxBatchClient.prototype.getAccount = function (checkDev) {
            if (checkDev === void 0) { checkDev = true; }
            if (checkDev == true && this.isDev == true) {
                return this.account + '_dev';
            }
            return this.account;
        };
        BxBatchClient.prototype.getUsername = function () {
            return this.getAccount(false);
        };
        BxBatchClient.prototype.getPassword = function () {
            return this.password;
        };
        BxBatchClient.prototype.getApiKey = function () {
            return this.apiKey;
        };
        BxBatchClient.prototype.getApiSecret = function () {
            return this.apiSecret;
        };
        BxBatchClient.prototype.addNotification = function (type, notification) {
            if (this.notifications[type] === null) {
                this.notifications[type] = Array();
            }
            this.notifications[type].push(notification);
        };
        return BxBatchClient;
    }());
    exports.BxBatchClient = BxBatchClient;
});
//# sourceMappingURL=BxBatchClient.js.map