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
    var thrift_types = require('./bxthrift/p13n_types');
    var thrift_P13nService = require('./bxthrift/P13nService');
    var bxRecommendationRequest = require("./BxRecommendationRequest");
    var bxChooseResponse = require("./BxChooseResponse");
    var thrift = require('thrift-http');
    var btoa = require('btoa');
    var get_IP = require('ip');
    var BxClient = /** @class */ (function () {
        function BxClient(account, password, domain, isDev, host, request, port, uri, schema, p13n_username, p13n_password, apiKey, apiSecret) {
            if (isDev === void 0) { isDev = false; }
            if (host === void 0) { host = null; }
            if (request === void 0) { request = null; }
            if (port === void 0) { port = null; }
            if (uri === void 0) { uri = null; }
            if (schema === void 0) { schema = null; }
            if (p13n_username === void 0) { p13n_username = null; }
            if (p13n_password === void 0) { p13n_password = null; }
            if (apiKey === void 0) { apiKey = null; }
            if (apiSecret === void 0) { apiSecret = null; }
            this.isTest = null;
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
            this.socketHost = null;
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
            if (this.host == null) {
                this.host = "cdn.bx-cloud.com";
            }
            this.port = port;
            if (this.port == null) {
                this.port = 443;
            }
            this.uri = uri;
            if (this.uri == null) {
                this.uri = '/p13n.web/p13n';
            }
            this.schema = schema;
            if (this.schema == null) {
                this.schema = 'https';
            }
            this.p13n_username = p13n_username;
            if (this.p13n_username == null) {
                this.p13n_username = "boxalino";
            }
            this.p13n_password = p13n_password;
            if (this.p13n_password == null) {
                this.p13n_password = "tkZ8EXfzeZc6SdXZntCU";
            }
            this.domain = domain;
            this.apiKey = apiKey;
            if (apiKey === null || apiKey === "") {
                this.apiKey = null;
            }
            this.apiSecret = apiSecret;
            if (apiSecret === null || apiSecret === "") {
                this.apiSecret = null;
            }
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
            var client;
            var spval = this.getSessionAndProfile();
            this.sessionId = spval[0];
            this.profileId = spval[1];
            var options = {
                transport: thrift.TBufferedTransport,
                protocol: thrift.TJSONProtocol,
                path: this.uri,
                https: true,
                headers: {
                    "Authorization": "Basic " + btoa(this.p13n_username + ":" + this.p13n_password),
                    "profileId": this.profileId
                }
            };
            var connection = thrift.createHttpConnection(this.host, "443", options);
            client = thrift.createHttpClient(thrift_P13nService.Client, connection);
            // tclient.myServiceFunction();
            //client = thrift_P13nService.Client(tclient);
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
            // return requesturi;
            return "https://";
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
                'User-URL': [this.getCurrentURL()]
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
                throw new Error("Configuration not live on account " + this.getAccount() + ": choice choiceId doesn't exist. NB: If you get a message indicating that the choice doesn't exist, go to http://intelligence.bx-cloud.com, log in your account and make sure that the choice id you want to use is published.");
            }
            if (e.toString().indexOf('Solr returned status 404') !== false) {
                throw new Error("Data not live on account " + this.getAccount() + ": index returns status 404. Please publish your data first, like in example backend_data_basic.php.");
            }
            if (e.toString().indexOf('undefined field') !== false) {
                var parts = e.message.split('undefined field');
                pieces = parts[1].split('	at ');
                var field = pieces[0].replace(':', '');
                throw new Error("You request in your filter or facets a non-existing field of your account " + this.getAccount() + ": field field doesn't exist.");
            }
            if (e.toString().indexOf('All choice variants are excluded') !== false) {
                throw new Error("You have an invalid configuration for with a choice defined, but having no defined strategies. This is a quite unusual case, please contact support@boxalino.com to get support.");
            }
            throw e;
        };
        BxClient.prototype.p13nchoose = function (choiceRequest) {
            try {
                var choiceResponse = this.getP13n(this._timeout).choose(choiceRequest);
                console.log(JSON.stringify(choiceResponse));
                if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                    this.addNotification('bxRequest', choiceRequest);
                    this.addNotification('bxResponse', choiceResponse);
                }
                if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null) && this.requestMap['dev_bx_disp'] == 'true') {
                    var debug_1 = true;
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
                        // ini_set('xdebug.var_display_max_children', -1);
                        // ini_set('xdebug.var_display_max_data', -1);
                        // ini_set('xdebug.var_display_max_depth', -1);
                        this.debugOutput = "<pre><h1>Choice Request</h1>" + choiceRequest.toString() + "<br><h1>Choice Response</h1>" + choiceResponse.toString() + "</pre>";
                        if (!this.debugOutputActive) {
                            console.log(this.debugOutput);
                            return;
                        }
                    }
                }
                if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                    this.addNotification('bxRequest', choiceRequest);
                    this.addNotification('bxResponse', choiceResponse);
                }
                return choiceResponse;
            }
            catch (e) {
                this.throwCorrectP13nException(e);
            }
        };
        BxClient.prototype.p13nchooseAll = function (choiceRequestBundle) {
            try {
                var bundleChoiceResponse = this.getP13n(this._timeout).chooseAll(choiceRequestBundle);
                if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null)
                    && this.requestMap['dev_bx_disp'] == 'true') {
                    // ini_set('xdebug.var_display_max_children', -1);
                    // ini_set('xdebug.var_display_max_data', -1);
                    // ini_set('xdebug.var_display_max_depth', -1);
                    this.debugOutput = "<pre><h1>Bundle Choice Request</h1>" + choiceRequestBundle.toString() + "<br><h1>Bundle Choice Response</h1>" + bundleChoiceResponse.toString() + "</pre>";
                    if (!this.debugOutputActive) {
                        console.log(this.debugOutput);
                        return;
                    }
                }
                if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                    this.addNotification('bxRequest', choiceRequestBundle);
                    this.addNotification('bxResponse', bundleChoiceResponse);
                }
                return bundleChoiceResponse;
            }
            catch (e) {
                this.throwCorrectP13nException(e);
            }
        };
        BxClient.prototype.addRequest = function (request) {
            request.setDefaultIndexId(this.getAccount());
            request.setDefaultRequestMap(this.requestMap);
            this.chooseRequests.push(request);
            return (this.chooseRequests.indexOf()) - 1;
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
                if (request instanceof bxRecommendationRequest.BxRecommendationRequest) {
                    requests.push(request);
                }
            });
            return requests;
        };
        BxClient.prototype.getThriftChoiceRequest = function (size) {
            if (size === void 0) { size = 0; }
            if (this.chooseRequests.length == 0 && this.autocompleteRequests.length > 0) {
                var spval = this.getSessionAndProfile();
                var sessionid = spval[0];
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
            var response;
            if (chooseAll) {
                var bundleResponse = this.p13nchooseAll(this.getThriftBundleChoiceRequest());
                var variants_1 = Array();
                bundleResponse.responses.forEach(function (choiceResponse) {
                    variants_1 = variants_1.concat(choiceResponse.variants);
                });
                response = new thrift_types.ChoiceResponse({ 'variants': variants_1 });
            }
            else {
                response = this.p13nchoose(this.getThriftChoiceRequest(size));
                if (size > 0) {
                    response.variants = this.chooseResponses.variants.concat(response.variants);
                }
            }
            this.chooseResponses = response;
        };
        BxClient.prototype.flushResponses = function () {
            this.autocompleteResponses = null;
            this.chooseResponses = null;
        };
        BxClient.prototype.getResponse = function (chooseAll) {
            if (chooseAll === void 0) { chooseAll = false; }
            var _chResponseSize = 0;
            if (this.chooseResponses !== null) {
                _chResponseSize = this.chooseResponses.variants.length;
            }
            var size = this.chooseRequests.length - _chResponseSize;
            if (this.chooseResponses == null) {
                this.choose(chooseAll);
            }
            else if (size) {
                this.choose(chooseAll, size);
            }
            var bxChooseResponseData = new bxChooseResponse.BxChooseResponse(this.chooseResponses, this.chooseRequests);
            bxChooseResponseData.setNotificationMode(this.getNotificationMode());
            return bxChooseResponseData;
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
            var spval = this.getSessionAndProfile();
            var sessionid = spval[0];
            var profileid = spval[1];
            var userRecord = this.getUserRecord();
            var tempArray = this.autocompleteRequests;
            var p13nrequests = tempArray.map(function () {
                this.getAutocompleteThriftRequest(profileid, userRecord);
            });
            var i = -1;
            var tempArrayBxAuto = this.p13nautocompleteAll(p13nrequests);
            this.autocompleteResponses = tempArrayBxAuto.map(function () {
                this.autocompletePartail(this.request, ++i);
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
            var requestBundle = new thrift_types.AutocompleteRequestBundle();
            requestBundle.requests = requests;
            try {
                var choiceResponse = this.getP13n(this._timeout).autocompleteAll(requestBundle).responses;
                if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null) && this.requestMap['dev_bx_disp'] == 'true') {
                    // ini_set('xdebug.var_display_max_children', -1);
                    // ini_set('xdebug.var_display_max_data', -1);
                    // ini_set('xdebug.var_display_max_depth', -1);
                    this.debugOutput = "<pre><h1>Request bundle</h1>" + requestBundle.toString() + "<br><h1>Choice Response</h1>" + choiceResponse.toString() + "</pre>";
                    if (!this.debugOutputActive) {
                        console.log(this.debugOutput);
                        return;
                    }
                }
                if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                    this.addNotification('bxRequest', requestBundle);
                    this.addNotification('bxResponse', choiceResponse);
                }
                return choiceResponse;
            }
            catch (e) {
                this.throwCorrectP13nException(e);
            }
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
            var final = this.notifications;
            final['response'] = this.getResponse().getNotifications();
            return final;
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