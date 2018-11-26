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
        define(["require", "exports", "./BxRecommendationRequest", "./BxChooseResponse"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cookies = require('js-cookie');
    var secureRandom = require('securerandom');
    var thrift_types = require('./bxthrift/p13n_types.js');
    var thrift_P13nService = require('./bxthrift/P13nService.js');
    var thrift = require('thrift-http');
    var btoa = require('btoa');
    var get_IP = require('ip');
    var BxRecommendationRequest_1 = require("./BxRecommendationRequest");
    var BxChooseResponse_1 = require("./BxChooseResponse");
    var BxClient = /** @class */ (function () {
        function BxClient(account, password, domain, isDev, host, request, port, uri, schema, p13n_username, p13n_password, apiKey, apiSecret) {
            if (isDev === void 0) { isDev = false; }
            if (host === void 0) { host = "api.bx-cloud.com"; }
            if (request === void 0) { request = {}; }
            if (port === void 0) { port = 443; }
            if (uri === void 0) { uri = "/p13n.web/p13n"; }
            if (schema === void 0) { schema = "https"; }
            if (p13n_username === void 0) { p13n_username = "boxalino"; }
            if (p13n_password === void 0) { p13n_password = "tkZ8EXfzeZc6SdXZntCU"; }
            if (apiKey === void 0) { apiKey = null; }
            if (apiSecret === void 0) { apiSecret = null; }
            this.apiKey = null;
            this.apiSecret = null;
            this.isTest = false;
            this.debugOutput = '';
            this.debugOutputActive = false;
            this.autocompleteRequests = null;
            this.autocompleteResponses = null;
            this.chooseRequests = Array();
            this.chooseResponses = null;
            this.bundleChooseRequests = Array();
            this._timeout = 2;
            this.requestContextParameters = Array();
            this.sessionId = null;
            this.profileId = null;
            this.requestMap = Array();
            this.socketHost = "";
            this.socketPort = null;
            this.socketSendTimeout = null;
            this.socketRecvTimeout = null;
            this.notifications = Array();
            this.request = null;
            this.choiceIdOverwrite = "owbx_choice_id";
            this.account = account;
            this.password = password;
            this.request = request;
            // if (this.requestMap == null) {
            //     this.requestMap = _REQUEST;
            // }
            this.isDev = isDev;
            this.host = host;
            this.port = port;
            this.uri = uri;
            ;
            this.schema = schema;
            this.p13n_username = p13n_username;
            this.p13n_password = p13n_password;
            this.domain = domain;
            this.apiKey = apiKey;
            this.apiSecret = apiSecret;
        }
        BxClient.prototype.setHost = function (host) {
            this.host = host;
        };
        BxClient.prototype.setApiKey = function (apiKey) {
            this.apiKey = apiKey;
        };
        BxClient.prototype.setApiSecret = function (apiSecret) {
            this.apiSecret = apiSecret;
        };
        BxClient.prototype.setTestMode = function (isTest) {
            this.isTest = isTest;
        };
        BxClient.prototype.setSocket = function (socketHost, socketPort, socketSendTimeout, socketRecvTimeout) {
            if (socketPort === void 0) { socketPort = 4040; }
            if (socketSendTimeout === void 0) { socketSendTimeout = 1000; }
            if (socketRecvTimeout === void 0) { socketRecvTimeout = 1000; }
            this.socketHost = socketHost;
            this.socketPort = socketPort;
            this.socketSendTimeout = socketSendTimeout;
            this.socketRecvTimeout = socketRecvTimeout;
        };
        BxClient.prototype.setRequestMap = function (requestMap) {
            this.requestMap = requestMap;
        };
        BxClient.prototype.getChoiceIdOverwrite = function () {
            if (typeof (this.requestMap[this.choiceIdOverwrite]) != "undefined" && this.requestMap[this.choiceIdOverwrite] !== null) {
                return this.requestMap[this.choiceIdOverwrite];
            }
            return null;
        };
        BxClient.prototype.getRequestMap = function () {
            return this.requestMap;
        };
        BxClient.prototype.addToRequestMap = function (key, value) {
            this.requestMap[key] = value;
        };
        BxClient.prototype.getAccount = function (checkDev) {
            if (checkDev === void 0) { checkDev = true; }
            if (checkDev && this.isDev) {
                return this.account + '_dev';
            }
            return this.account;
        };
        BxClient.prototype.getUsername = function () {
            return this.getAccount(false);
        };
        BxClient.prototype.getPassword = function () {
            return this.password;
        };
        BxClient.prototype.getApiKey = function () {
            return this.apiKey;
        };
        BxClient.prototype.getApiSecret = function () {
            return this.apiSecret;
        };
        BxClient.prototype.setSessionAndProfile = function (sessionId, profileId) {
            this.sessionId = sessionId;
            this.profileId = profileId;
        };
        BxClient.prototype.getSessionAndProfile = function () {
            if (this.sessionId !== null && this.profileId !== null) {
                return Array(this.sessionId, this.profileId);
            }
            if (Cookies !== null) {
                if (Cookies.get('cems') === null || Cookies.get('cems') === "" || Cookies.get('cems') === undefined) {
                    this.sessionId = secureRandom.hex(12);
                }
                else {
                    this.sessionId = Cookies.get('cems');
                }
            }
            else {
                this.sessionId = secureRandom.hex(12);
            }
            if (Cookies !== null) {
                if (Cookies.get('cemv') === null || Cookies.get('cemv') === "" || Cookies.get('cemv') === undefined) {
                    this.profileId = secureRandom.hex(12);
                }
                else {
                    this.profileId = Cookies.get('cemv');
                }
            }
            else {
                this.profileId = secureRandom.hex(12);
            }
            // Refresh cookies
            if (this.domain === null && this.domain === "") {
                Cookies.set('cems', this.sessionId, { expires: 0 });
                Cookies.set('cemv', this.profileId, { expires: 365 });
            }
            else {
                Cookies.set('cems', this.sessionId, { expires: 0, path: '/', domain: this.domain });
                Cookies.set('cemv', this.sessionId, { expires: 365, path: '/', domain: this.domain });
            }
            this.sessionId = this.sessionId;
            this.profileId = this.profileId;
            return Array(this.sessionId, this.profileId);
        };
        BxClient.prototype.getUserRecord = function () {
            var userRecord = new thrift_types.UserRecord();
            if (userRecord !== undefined) {
                userRecord.username = this.getAccount();
                userRecord.apiKey = this.getApiKey();
                userRecord.apiSecret = this.getApiSecret();
            }
            return userRecord;
        };
        BxClient.prototype.getP13n = function (timeout, useCurlIfAvailable) {
            if (timeout === void 0) { timeout = 2; }
            if (useCurlIfAvailable === void 0) { useCurlIfAvailable = true; }
            var spval = this.getSessionAndProfile();
            this.profileId = spval[1];
            var connection = thrift.createHttpConnection(this.host, this.port, {
                transport: thrift.TBufferedTransport,
                protocol: thrift.TCompactProtocol,
                path: this.uri,
                https: true,
                headers: {
                    "Accept": "application/x-thrift",
                    "Content-Type": "application/x-thrift",
                    "X-BX-PROFILEID": this.profileId,
                    "Authorization": "Basic " + btoa(this.p13n_username + ":" + this.p13n_password)
                },
            });
            var client = new thrift.createHttpClient(thrift_P13nService, connection);
            return client;
        };
        BxClient.prototype.getChoiceRequest = function (inquiries, requestContext) {
            if (requestContext === void 0) { requestContext = null; }
            var choiceRequest = new thrift_types.ChoiceRequest();
            var spval = this.getSessionAndProfile();
            var profileid = spval[1];
            choiceRequest.userRecord = this.getUserRecord();
            choiceRequest.profileId = profileid;
            choiceRequest.inquiries = inquiries;
            if (requestContext == null) {
                requestContext = this.getRequestContext();
            }
            choiceRequest.requestContext = requestContext;
            return choiceRequest;
        };
        BxClient.prototype.getIP = function () {
            var ip = get_IP.address();
            return ip;
        };
        BxClient.prototype.getCurrentURL = function () {
            var protocol = this.request.protocol;
            var hostname = this.request.host;
            var requesturi = this.request.url;
            if (hostname == "") {
                return "";
            }
            return protocol + "://" + hostname + requesturi;
        };
        BxClient.prototype.forwardRequestMapAsContextParameters = function (filterPrefix, setPrefix) {
            if (filterPrefix === void 0) { filterPrefix = ''; }
            if (setPrefix === void 0) { setPrefix = ''; }
            for (var key in this.requestMap) {
                var value = this.requestMap[key];
                if (filterPrefix != '') {
                    if (key.indexOf(filterPrefix) !== 0) {
                        continue;
                    }
                }
                this.requestContextParameters[setPrefix.key] = Array.isArray(value) ? value : Array(value);
            }
        };
        BxClient.prototype.addRequestContextParameter = function (name, values) {
            if (!Array.isArray(values)) {
                values = Array(values);
            }
            this.requestContextParameters[name] = values;
        };
        BxClient.prototype.resetRequestContextParameter = function () {
            this.requestContextParameters = Array();
        };
        BxClient.prototype.getBasicRequestContextParameters = function () {
            var spval = this.getSessionAndProfile();
            var sessionid = spval[0];
            var profileid = spval[1];
            return {
                'User-Agent': ['Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36'],
                'User-Host': [this.getIP()],
                'User-SessionId': [sessionid],
                'User-Referer': [this.getCurrentURL()],
                'User-URL': [this.getCurrentURL()],
                'X-BX-PROFILEID': [profileid]
            };
        };
        BxClient.prototype.getRequestContextParameters = function () {
            var params = this.requestContextParameters;
            this.chooseRequests.forEach(function (request) {
                for (var k in request.getRequestContextParameters()) {
                    var v = request.getRequestContextParameters()[k];
                    if (!Array.isArray(v)) {
                        v = Array(v);
                    }
                    params[k] = v;
                }
            });
            return params;
        };
        BxClient.prototype.getRequestContext = function () {
            var requestContext = new thrift_types.RequestContext();
            requestContext.parameters = this.getBasicRequestContextParameters();
            for (var k in this.getRequestContextParameters()) {
                var v = this.getRequestContextParameters()[k];
                requestContext.parameters[k] = v;
            }
            if ((typeof (this.requestMap['p13nRequestContext']) != "undefined" && this.requestMap['p13nRequestContext'] !== null)
                && Array.isArray(this.requestMap['p13nRequestContext'])) {
                requestContext.parameters = this.requestMap['p13nRequestContext'].concat(requestContext.parameters);
            }
            return requestContext;
        };
        BxClient.prototype.throwCorrectP13nException = function (e) {
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
        BxClient.prototype.p13nchoose = function (choiceRequest) {
            return __awaiter(this, void 0, void 0, function () {
                var client, choiceResponse, debug_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            client = this.getP13n(this._timeout);
                            choiceResponse = null;
                            return [4 /*yield*/, client.choose(choiceRequest)];
                        case 1:
                            choiceResponse = _a.sent();
                            if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                                this.addNotification('bxRequest', choiceRequest);
                                this.addNotification('bxResponse', choiceResponse);
                            }
                            if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null) && this.requestMap['dev_bx_disp'] == 'true') {
                                debug_1 = true;
                                if ((typeof (this.requestMap['dev_bx_choice']) != "undefined" && this.requestMap['dev_bx_choice'] !== null)) {
                                    debug_1 = false;
                                    choiceRequest.inquiries.forEach(function (inquiry) {
                                        if (inquiry.choiceId == this.requestMap['dev_bx_choice']) {
                                            debug_1 = true;
                                            return;
                                        }
                                    });
                                }
                                if (debug_1) {
                                    this.debugOutput = "<pre><h1>Choice Request</h1>" + choiceRequest.toString() + "<br><h1>Choice Response</h1>" + choiceResponse.toString() + "</pre>";
                                    if (!this.debugOutputActive) {
                                        console.log(this.debugOutput);
                                        return [2 /*return*/];
                                    }
                                }
                            }
                            if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                                this.addNotification('bxRequest', choiceRequest);
                                this.addNotification('bxResponse', choiceResponse);
                            }
                            return [2 /*return*/, choiceResponse];
                        case 2:
                            e_1 = _a.sent();
                            this.throwCorrectP13nException(e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BxClient.prototype.p13nchooseAll = function (choiceRequestBundle) {
            return __awaiter(this, void 0, void 0, function () {
                var bundleChoiceResponse, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            bundleChoiceResponse = null;
                            return [4 /*yield*/, this.getP13n(this._timeout).chooseAll(choiceRequestBundle)];
                        case 1:
                            bundleChoiceResponse = _a.sent();
                            if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null)
                                && this.requestMap['dev_bx_disp'] == 'true') {
                                this.debugOutput = "<pre><h1>Bundle Choice Request</h1>" + choiceRequestBundle.toString() + "<br><h1>Bundle Choice Response</h1>" + bundleChoiceResponse.toString() + "</pre>";
                                if (!this.debugOutputActive) {
                                    console.log(this.debugOutput);
                                    return [2 /*return*/];
                                }
                            }
                            if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                                this.addNotification('bxRequest', choiceRequestBundle);
                                this.addNotification('bxResponse', bundleChoiceResponse);
                            }
                            return [2 /*return*/, bundleChoiceResponse];
                        case 2:
                            e_2 = _a.sent();
                            this.throwCorrectP13nException(e_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BxClient.prototype.addRequest = function (request) {
            request.setDefaultIndexId(this.getAccount());
            request.setDefaultRequestMap(this.requestMap);
            this.chooseRequests.push(request);
            return (this.chooseRequests.length) - 1;
        };
        BxClient.prototype.addBundleRequest = function (requests) {
            requests.forEach(function (request) {
                request.setDefaultIndexId(this.getAccount());
                request.setDefaultRequestMap(this.requestMap);
            });
            this.bundleChooseRequests.push(requests);
        };
        BxClient.prototype.resetRequests = function () {
            this.chooseRequests = Array();
            this.bundleChooseRequests = Array();
        };
        BxClient.prototype.getRequest = function (index) {
            if (index === void 0) { index = 0; }
            if (this.chooseRequests.length <= index) {
                return null;
            }
            return this.chooseRequests[index];
        };
        BxClient.prototype.getChoiceIdRecommendationRequest = function (choiceId) {
            this.chooseRequests.forEach(function (request) {
                if (request.getChoiceId() == choiceId) {
                    return request;
                }
            });
            return null;
        };
        BxClient.prototype.getRecommendationRequests = function () {
            var requests = Array();
            this.chooseRequests.forEach(function (request) {
                if (request instanceof BxRecommendationRequest_1.BxRecommendationRequest) {
                    requests.push(request);
                }
            });
            return requests;
        };
        BxClient.prototype.getThriftChoiceRequest = function (size) {
            if (size === void 0) { size = 0; }
            if (this.chooseRequests.length == 0 && this.autocompleteRequests.length > 0) {
                var spval = this.getSessionAndProfile();
                var profileid_1 = spval[1];
                var userRecord_1 = this.getUserRecord();
                var tempArray = this.autocompleteRequests;
                var p13nrequests = tempArray.map(function () {
                    this.getAutocompleteThriftRequest(profileid_1, userRecord_1);
                });
                return p13nrequests;
            }
            var choiceInquiries = Array();
            var requests = size === 0 ? this.chooseRequests : this.chooseRequests.slice(-size);
            var that = this;
            requests.forEach(function (request) {
                var choiceInquiry = new thrift_types.ChoiceInquiry();
                //let choiceInquiry: any = thrift_types.ChoiceInquiry;
                choiceInquiry.choiceId = request.getChoiceId();
                if (choiceInquiries.length == 0 && that.getChoiceIdOverwrite()) {
                    choiceInquiry.choiceId = that.getChoiceIdOverwrite();
                }
                if (that.isTest === true || (that.isDev && that.isTest === null)) {
                    choiceInquiry.choiceId = choiceInquiry.choiceId + "_debugtest";
                }
                choiceInquiry.simpleSearchQuery = request.getSimpleSearchQuery(that.getAccount());
                choiceInquiry.contextItems = request.getContextItems();
                choiceInquiry.minHitCount = request.getMin();
                choiceInquiry.withRelaxation = request.getWithRelaxation();
                choiceInquiries.push(choiceInquiry);
            });
            var choiceRequest = this.getChoiceRequest(choiceInquiries, this.getRequestContext());
            return choiceRequest;
        };
        BxClient.prototype.getBundleChoiceRequest = function (inquiries, requestContext) {
            if (requestContext === void 0) { requestContext = null; }
            var choiceRequest = new thrift_types.ChoiceRequest();
            var spval = this.getSessionAndProfile();
            var profileid = spval[1];
            choiceRequest.userRecord = this.getUserRecord();
            choiceRequest.profileId = profileid;
            choiceRequest.inquiries = inquiries;
            if (requestContext == null) {
                requestContext = this.getRequestContext();
            }
            choiceRequest.requestContext = requestContext;
            return choiceRequest;
        };
        BxClient.prototype.getThriftBundleChoiceRequest = function () {
            var bundleRequest = Array();
            this.bundleChooseRequests.forEach(function (bundleChooseRequest) {
                var choiceInquiries = Array();
                bundleChooseRequest.forEach(function (request) {
                    this.addRequest(request);
                    var choiceInquiry = new thrift_types.ChoiceInquiry();
                    choiceInquiry.choiceId = request.getChoiceId();
                    if (this.isTest === true || (this.isDev && this.isTest === null)) {
                        choiceInquiry.choiceId = choiceInquiry.choiceId + "_debugtest";
                    }
                    choiceInquiry.simpleSearchQuery = request.getSimpleSearchQuery(this.getAccount());
                    choiceInquiry.contextItems = request.getContextItems();
                    choiceInquiry.minHitCount = request.getMin();
                    choiceInquiry.withRelaxation = request.getWithRelaxation();
                    choiceInquiries.push(choiceInquiry);
                });
                bundleRequest.push(this.getBundleChoiceRequest(choiceInquiries, this.getRequestContext()));
            });
            return new thrift_types.ChoiceRequestBundle({ 'requests': bundleRequest });
        };
        BxClient.prototype.choose = function (chooseAll, size) {
            if (chooseAll === void 0) { chooseAll = false; }
            if (size === void 0) { size = 0; }
            return __awaiter(this, void 0, void 0, function () {
                var response, bundleResponse, variants_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!chooseAll) return [3 /*break*/, 1];
                            bundleResponse = this.p13nchooseAll(this.getThriftBundleChoiceRequest());
                            variants_1 = Array();
                            bundleResponse.responses.forEach(function (choiceResponse) {
                                variants_1 = variants_1.concat(choiceResponse.variants);
                            });
                            response = new thrift_types.ChoiceResponse({ 'variants': variants_1 });
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.p13nchoose(this.getThriftChoiceRequest(size))];
                        case 2:
                            response = _a.sent();
                            if (size > 0) {
                                response.variants = this.chooseResponses.variants.concat(response.variants);
                            }
                            _a.label = 3;
                        case 3:
                            this.chooseResponses = response;
                            return [2 /*return*/];
                    }
                });
            });
        };
        BxClient.prototype.flushResponses = function () {
            this.autocompleteResponses = null;
            this.chooseResponses = null;
        };
        BxClient.prototype.getResponse = function (chooseAll) {
            if (chooseAll === void 0) { chooseAll = false; }
            return __awaiter(this, void 0, void 0, function () {
                var _chResponseSize, size, bxChooseResponseData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _chResponseSize = 0;
                            if (this.chooseResponses !== null) {
                                _chResponseSize = this.chooseResponses.variants.length;
                            }
                            size = this.chooseRequests.length - _chResponseSize;
                            if (!(this.chooseResponses == null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.choose(chooseAll)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            if (!size) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.choose(chooseAll, size)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            bxChooseResponseData = new BxChooseResponse_1.BxChooseResponse(this.chooseResponses, this.chooseRequests);
                            bxChooseResponseData.setNotificationMode(this.getNotificationMode());
                            return [2 /*return*/, bxChooseResponseData];
                    }
                });
            });
        };
        BxClient.prototype.getNotificationMode = function () {
            return (typeof (this.requestMap['dev_bx_notifications']) != "undefined" && this.requestMap['dev_bx_notifications'] !== null) && this.requestMap['dev_bx_notifications'] == 'true';
        };
        BxClient.prototype.setAutocompleteRequest = function (request) {
            this.setAutocompleteRequests(Array(request));
        };
        BxClient.prototype.setAutocompleteRequests = function (requests) {
            requests.forEach(function (request) {
                this.enhanceAutoCompleterequest(request);
            });
            this.autocompleteRequests = requests;
        };
        BxClient.prototype.enhanceAutoCompleterequest = function (request) {
            request.setDefaultIndexId(this.getAccount());
            return this;
        };
        BxClient.prototype.p13nautocomplete = function (autocompleteRequest) {
            try {
                var choiceResponse = this.getP13n(this._timeout).autocomplete(autocompleteRequest);
                if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null) && this.requestMap['dev_bx_disp'] == 'true') {
                    // ini_set('xdebug.var_display_max_children', -1);
                    // ini_set('xdebug.var_display_max_data', -1);
                    // ini_set('xdebug.var_display_max_depth', -1);
                    this.debugOutput = "<pre><h1>Autocomplete Request</h1>" + autocompleteRequest.toString() + "<br><h1>Choice Response</h1>" + choiceResponse.toString() + "</pre>";
                    if (!this.debugOutputActive) {
                        console.log(this.debugOutput);
                        return;
                    }
                }
                if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                    this.addNotification('bxRequest', autocompleteRequest);
                    this.addNotification('bxResponse', choiceResponse);
                }
                return choiceResponse;
            }
            catch (e) {
                this.throwCorrectP13nException(e);
            }
        };
        BxClient.prototype.autocomplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var spval, profileid, userRecord, tempArray, p13nrequests, i, tempArrayBxAuto;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spval = this.getSessionAndProfile();
                            profileid = spval[1];
                            userRecord = this.getUserRecord();
                            tempArray = this.autocompleteRequests;
                            p13nrequests = tempArray.map(function () {
                                this.getAutocompleteThriftRequest(profileid, userRecord);
                            });
                            i = -1;
                            return [4 /*yield*/, this.p13nautocompleteAll(p13nrequests)];
                        case 1:
                            tempArrayBxAuto = _a.sent();
                            this.autocompleteResponses = tempArrayBxAuto.map(function () {
                                this.autocompletePartail(this.request, ++i);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        BxClient.prototype.getAutocompleteResponse = function () {
            var responses = this.getAutocompleteResponses();
            if (typeof (responses[0]) != "undefined" && responses[0] !== null) {
                return responses[0];
            }
            return null;
        };
        BxClient.prototype.p13nautocompleteAll = function (requests) {
            return __awaiter(this, void 0, void 0, function () {
                var requestBundle, choiceResponse, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            requestBundle = new thrift_types.AutocompleteRequestBundle();
                            requestBundle.requests = requests;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            choiceResponse = null;
                            return [4 /*yield*/, this.getP13n(this._timeout).autocompleteAll(requestBundle).responses];
                        case 2:
                            choiceResponse = _a.sent();
                            if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null) && this.requestMap['dev_bx_disp'] == 'true') {
                                this.debugOutput = "<pre><h1>Request bundle</h1>" + requestBundle.toString() + "<br><h1>Choice Response</h1>" + choiceResponse.toString() + "</pre>";
                                if (!this.debugOutputActive) {
                                    console.log(this.debugOutput);
                                    return [2 /*return*/];
                                }
                            }
                            if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                                this.addNotification('bxRequest', requestBundle);
                                this.addNotification('bxResponse', choiceResponse);
                            }
                            return [2 /*return*/, choiceResponse];
                        case 3:
                            e_3 = _a.sent();
                            this.throwCorrectP13nException(e_3);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        BxClient.prototype.getAutocompleteResponses = function () {
            if (!this.autocompleteResponses) {
                this.autocomplete();
            }
            return this.autocompleteResponses;
        };
        BxClient.prototype.setTimeout = function (timeout) {
            this._timeout = timeout;
            return this;
        };
        BxClient.prototype.getDebugOutput = function () {
            return this.debugOutput;
        };
        BxClient.prototype.setDebugOutputActive = function (debugOutputActive) {
            this.debugOutputActive = debugOutputActive;
        };
        BxClient.prototype.notifyWarning = function (warning) {
            this.addNotification("warning", warning);
        };
        BxClient.prototype.addNotification = function (type, notification) {
            if (this.notifications[type] === null) {
                this.notifications[type] = Array();
            }
            this.notifications[type].push(notification);
        };
        BxClient.prototype.getNotifications = function () {
            return __awaiter(this, void 0, void 0, function () {
                var final, resp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            final = this.notifications;
                            return [4 /*yield*/, this.getResponse()];
                        case 1:
                            resp = _a.sent();
                            final['response'] = resp.getNotifications();
                            return [2 /*return*/, final];
                    }
                });
            });
        };
        BxClient.prototype.finalNotificationCheck = function (force, requestMapKey) {
            if (force === void 0) { force = false; }
            if (requestMapKey === void 0) { requestMapKey = 'dev_bx_notifications'; }
            if (force || ((typeof (this.requestMap[requestMapKey]) != "undefined" && this.requestMap[requestMapKey] !== null) && this.requestMap[requestMapKey] == 'true')) {
                var value = "<pre><h1>Notifications</h1>" + this.notifications.toString() + "</pre>";
                if (!this.debugOutputActive) {
                    console.log(value);
                    return;
                }
                return value;
            }
        };
        return BxClient;
    }());
    exports.BxClient = BxClient;
});
//# sourceMappingURL=BxClient.js.map