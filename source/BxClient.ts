let Cookies = require('js-cookie');
let secureRandom = require('securerandom');
let thrift_types = require('./bxthrift/p13n_types');
let thrift_P13nService = require('./bxthrift/P13nService');
import * as bxRecommendationRequest from './BxRecommendationRequest'
import * as bxChooseResponse from './BxChooseResponse'
var tthrift = require('thrift');
var thrift = require('thrift-http');
var btoa = require('btoa');

export class BxClient {
    private account: any;
    private password: any;
    private isDev: any;
    private host: any;
    private apiKey: any;
    private apiSecret: any;
    private port: any;
    private uri: any;
    private schema: any;
    private p13n_username: any;
    private p13n_password: any;
    private domain: any;

    private isTest: any = null;

    private debugOutput: any = '';
    private debugOutputActive: any = false;
    private autocompleteRequests: any = null;
    private autocompleteResponses: any = null;
    private chooseRequests: any = Array();
    private chooseResponses: any = null;
    private bundleChooseRequests: any = Array();
    private _timeout: any = 2;
    private requestContextParameters: any = Array();

    private sessionId: any = null;
    private profileId: any = null;

    private requestMap: any = Array();

    private socketHost: any = null;
    private socketPort: any = null;
    private socketSendTimeout: any = null;
    private socketRecvTimeout: any = null;

    private notifications: any = Array();
    private request: any = null;
    private choiceIdOverwrite: any = "owbx_choice_id";
    constructor(account: any, password: any, domain: any, isDev: any = false, host: any = null, request: any = null, port: any = null, uri: any = null, schema: any = null, p13n_username: any = null, p13n_password: any = null, apiKey: any = null, apiSecret: any = null) {
        this.account = account;
        this.password = password;
        this.request = request
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

    setHost(host: any) {
        this.host = host;
    }

    setApiKey(apiKey: any) {
        this.apiKey = apiKey;
    }

    setApiSecret(apiSecret: any) {
        this.apiSecret = apiSecret;
    }

    setTestMode(isTest: any) {
        this.isTest = isTest;
    }

    setSocket(socketHost: any, socketPort: any = 4040, socketSendTimeout: any = 1000, socketRecvTimeout: any = 1000) {
        this.socketHost = socketHost;
        this.socketPort = socketPort;
        this.socketSendTimeout = socketSendTimeout;
        this.socketRecvTimeout = socketRecvTimeout;
    }

    setRequestMap(requestMap: any) {
        this.requestMap = requestMap;
    }

    getChoiceIdOverwrite() {
        if (typeof (this.requestMap[this.choiceIdOverwrite]) != "undefined" && this.requestMap[this.choiceIdOverwrite] !== null) {
            return this.requestMap[this.choiceIdOverwrite];
        }
        return null;
    }

    getRequestMap() {
        return this.requestMap;
    }

    addToRequestMap(key: any, value: any) {
        this.requestMap[key] = value;
    }

    getAccount(checkDev = true) {
        if (checkDev && this.isDev) {
            return this.account + '_dev';
        }
        return this.account;
    }

    getUsername() {
        return this.getAccount(false);
    }

    getPassword() {
        return this.password;
    }

    getApiKey() {
        return this.apiKey;
    }

    getApiSecret() {
        return this.apiSecret;
    }

    setSessionAndProfile(sessionId: any, profileId: any) {
        this.sessionId = sessionId;
        this.profileId = profileId;
    }

    getSessionAndProfile() {

        if (this.sessionId !== null && this.profileId !== null) {
            return Array(this.sessionId, this.profileId);
        }

        if (Cookies !== null) {
            if (Cookies.get('cems') === null || Cookies.get('cems') === "" || Cookies.get('cems') === undefined) {
                this.sessionId = secureRandom.hex(12);
            } else {
                this.sessionId = Cookies.get('cems');
            }
        } else {
            this.sessionId = secureRandom.hex(12);
        }

        if (Cookies !== null) {
            if (Cookies.get('cemv') === null || Cookies.get('cemv') === "" || Cookies.get('cemv') === undefined) {
                this.profileId = secureRandom.hex(12);
            } else {
                this.profileId = Cookies.get('cemv');
            }
        } else {
            this.profileId = secureRandom.hex(12);
        }

        // Refresh cookies
        if (this.domain === null && this.domain === "") {
            Cookies.set('cems', this.sessionId, { expires: 0 });
            Cookies.set('cemv', this.profileId, { expires: 365 });
        } else {
            Cookies.set('cems', this.sessionId, { expires: 0, path: '/', domain: this.domain });
            Cookies.set('cemv', this.sessionId, { expires: 365, path: '/', domain: this.domain });
        }

        this.sessionId = this.sessionId;
        this.profileId = this.profileId;

        return Array(this.sessionId, this.profileId);
    }

    private getUserRecord() {
        let userRecord: any = thrift_types.UserRecord;
        if (userRecord !== undefined) {
            userRecord.username = this.getAccount();
            userRecord.apiKey = this.getApiKey();
            userRecord.apiSecret = this.getApiSecret();
        }
        return userRecord;
    }

    private getP13n(timeout: any = 2, useCurlIfAvailable: any = true) {
        let client: any;
        let spval: any = this.getSessionAndProfile();
        this.sessionId = spval[0];
        this.profileId = spval[1];
        var options = {
            transport: tthrift.TBufferedTransport,
            protocol: tthrift.TJSONProtocol,
            path: this.uri,
            https: true,
            headers: {
                "Authorization": "Basic " + btoa(this.p13n_username + ":" + this.p13n_password),
                "profileId": this.profileId
            }
        };
        var connection = thrift.createHttpConnection(this.host, "443",  options);
        client = thrift.createHttpClient(thrift_P13nService.Client, connection);
       // tclient.myServiceFunction();
        //client = thrift_P13nService.Client(tclient);
        return client;
    }

    getChoiceRequest(inquiries: any, requestContext: any = null) {

        let choiceRequest: any = thrift_types.ChoiceRequest;
        let spval: any = this.getSessionAndProfile();
        let profileid = spval[1];

        choiceRequest.userRecord = this.getUserRecord();
        choiceRequest.profileId = profileid;
        choiceRequest.inquiries = inquiries;
        if (requestContext == null) {
            requestContext = this.getRequestContext();
        }
        choiceRequest.requestContext = requestContext;

        return choiceRequest;
    }

    protected getIP() {
        let ip: any = this.request.remote_ip
        return ip;
    }

    protected getCurrentURL() {
        let protocol: any = this.request.protocol;
        let hostname: any = this.request.host;
        let requesturi: any = this.request.url;
        if (hostname == "") {
            return "";
        }
        //return protocol + '://' + hostname.requesturi;
        return requesturi
    }

    forwardRequestMapAsContextParameters(filterPrefix: any = '', setPrefix: any = '') {
        for (let key in this.requestMap) {
            let value = this.requestMap[key];

            if (filterPrefix != '') {
                if (key.indexOf(filterPrefix) !== 0) {
                    continue;
                }
            }
            this.requestContextParameters[setPrefix.key] = Array.isArray(value) ? value : Array(value);
        }
    }

    addRequestContextParameter(name: any, values: any) {
        if (!Array.isArray(values)) {
            values = Array(values);
        }
        this.requestContextParameters[name] = values;
    }

    resetRequestContextParameter() {
        this.requestContextParameters = Array();
    }


    protected getBasicRequestContextParameters() {
        let spval: any = this.getSessionAndProfile();
        let sessionid: any = spval[0];
        let profileid: any = spval[1];

        return {
            'User-Agent': ['Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36'],
            'User-Host': [this.getIP()],
            'User-SessionId': [sessionid],
            'User-Referer': [this.getCurrentURL()],
            'User-URL': [this.getCurrentURL()]
        }
    }

    getRequestContextParameters() {
        let params: any = this.requestContextParameters;
        this.chooseRequests.forEach(function (request: any) {
            for (let k in request.getRequestContextParameters()) {
                let v: any = request.getRequestContextParameters()[k];
                if (!Array.isArray(v)) {
                    v = Array(v);
                }
                params[k] = v;
            }
        });
        return params;
    }

    protected getRequestContext() {
        let requestContext = thrift_types.RequestContext;
        requestContext.parameters = this.getBasicRequestContextParameters();
        for (let k in this.getRequestContextParameters()) {
            let v: any = this.getRequestContextParameters()[k];
            requestContext.parameters[k] = v;
        }

        if ((typeof (this.requestMap['p13nRequestContext']) != "undefined" && this.requestMap['p13nRequestContext'] !== null)
            && Array.isArray(this.requestMap['p13nRequestContext'])) {
            requestContext.parameters = this.requestMap['p13nRequestContext'].concat(requestContext.parameters);
        }

        return requestContext;
    }

    private throwCorrectP13nException(e: any) {
        let pieces: any;
        if (e.toString().indexOf('Could not connect ') !== false) {
            throw new Error('The connection to our server failed even before checking your credentials. This might be typically caused by 2 possible things: wrong values in host, port, schema or uri (typical value should be host=cdn.bx-cloud.com, port=443, uri =/p13n.web/p13n and schema=https, your values are : host=' + this.host + ', port=' + this.port + ', schema=' + this.schema + ', uri=' + this.uri + '). Another possibility, is that your server environment has a problem with ssl certificate (peer certificate cannot be authenticated with given ca certificates), which you can either fix, or avoid the problem by adding the line "curl_setopt(self::curlHandle, CURLOPT_SSL_VERIFYPEER, false);" in the file "lib\Thrift\Transport\P13nTCurlClient" after the call to curl_init in the function flush. Full error message=' + e.message);
        }
        if (e.toString().indexOf('Bad protocol id in TCompact message') !== false) {
            throw new Error('The connection to our server has worked, but your credentials were refused. Provided credentials username=' + this.p13n_username + ', password=' + this.p13n_password + '. Full error message=' + e.message);
        }
        if (e.toString().indexOf('choice not found') !== false) {
            let parts: any = e.message.split('choice not found');
            pieces = parts[1].split('	at ');
            let choiceId: any = pieces[0].trim().replace(':', '');
            throw new Error("Configuration not live on account " + this.getAccount() + ": choice choiceId doesn't exist. NB: If you get a message indicating that the choice doesn't exist, go to http://intelligence.bx-cloud.com, log in your account and make sure that the choice id you want to use is published.");
        }
        if (e.toString().indexOf('Solr returned status 404') !== false) {
            throw new Error("Data not live on account " + this.getAccount() + ": index returns status 404. Please publish your data first, like in example backend_data_basic.php.");
        }
        if (e.toString().indexOf('undefined field') !== false) {
            let parts: any = e.message.split('undefined field');
            pieces = parts[1].split('	at ');
            let field = pieces[0].replace(':', '');
            throw new Error("You request in your filter or facets a non-existing field of your account " + this.getAccount() + ": field field doesn't exist.");
        }
        if (e.toString().indexOf('All choice variants are excluded') !== false) {
            throw new Error("You have an invalid configuration for with a choice defined, but having no defined strategies. This is a quite unusual case, please contact support@boxalino.com to get support.");
        }
        throw e;
    }

    private p13nchoose(choiceRequest: any) {
        try {
            let choiceResponse: any = this.getP13n(this._timeout).choose(choiceRequest);
            if ((typeof (this.requestMap['dev_bx_debug']) != "undefined" && this.requestMap['dev_bx_debug'] !== null) && this.requestMap['dev_bx_debug'] == 'true') {
                this.addNotification('bxRequest', choiceRequest);
                this.addNotification('bxResponse', choiceResponse);
            }
            if ((typeof (this.requestMap['dev_bx_disp']) != "undefined" && this.requestMap['dev_bx_disp'] !== null) && this.requestMap['dev_bx_disp'] == 'true') {
                let debug: any = true;
                if ((typeof (this.requestMap['dev_bx_choice']) != "undefined" && this.requestMap['dev_bx_choice'] !== null)) {
                    debug = false;
                    choiceRequest.inquiries.forEach(function (inquiry: any) {
                        if (inquiry.choiceId == this.requestMap['dev_bx_choice']) {
                            debug = true;
                            return;
                        }
                    });
                }
                if (debug) {
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
        } catch (e) {
            this.throwCorrectP13nException(e);
        }
    }

    private p13nchooseAll(choiceRequestBundle: any) {
        try {
            let bundleChoiceResponse: any = this.getP13n(this._timeout).chooseAll(choiceRequestBundle);
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
        } catch (e) {
            this.throwCorrectP13nException(e);
        }
    }

    addRequest(request: any) {
        request.setDefaultIndexId(this.getAccount());
        request.setDefaultRequestMap(this.requestMap);
        this.chooseRequests.push(request);
        return (this.chooseRequests.indexOf()) - 1;
    }

    addBundleRequest(requests: any) {
        requests.forEach(function (request: any) {
            request.setDefaultIndexId(this.getAccount());
            request.setDefaultRequestMap(this.requestMap);
        });
        this.bundleChooseRequests.push(requests);
    }

    resetRequests() {
        this.chooseRequests = Array();
        this.bundleChooseRequests = Array();
    }

    getRequest(index = 0) {
        if (this.chooseRequests.length <= index) {
            return null;
        }
        return this.chooseRequests[index];
    }

    getChoiceIdRecommendationRequest(choiceId: any) {
        this.chooseRequests.forEach(function (request: any) {
            if (request.getChoiceId() == choiceId) {
                return request;
            }
        });
        return null;
    }

    getRecommendationRequests() {
        let requests: any = Array();
        this.chooseRequests.forEach(function (request: any) {
            if (request instanceof bxRecommendationRequest.BxRecommendationRequest) {
                requests.push(request);
            }
        });
        return requests;
    }

    getThriftChoiceRequest(size = 0) {
        if (this.chooseRequests.length == 0 && this.autocompleteRequests.length > 0) {
            let spval: any = this.getSessionAndProfile();
            let sessionid: any = spval[0];
            let profileid: any = spval[1];
            let userRecord: any = this.getUserRecord();
            let tempArray: any = this.autocompleteRequests;
            let p13nrequests: any = tempArray.map(function (this: any) {
                this.getAutocompleteThriftRequest(profileid, userRecord)
            });
            return p13nrequests;
        }

        let choiceInquiries: any = Array();
        let requests: any = size === 0 ? this.chooseRequests : this.chooseRequests.slice(-size);
        let that = this;
        requests.forEach(function (request: any) {
            let choiceInquiry: any = thrift_types.ChoiceInquiry;
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
        let choiceRequest: any = this.getChoiceRequest(choiceInquiries, this.getRequestContext());
        return choiceRequest;
    }

    getBundleChoiceRequest(inquiries: any, requestContext: any = null) {

        let choiceRequest: any = thrift_types.ChoiceRequest;

        let spval: any = this.getSessionAndProfile();
        let profileid: any = spval[1];

        choiceRequest.userRecord = this.getUserRecord();
        choiceRequest.profileId = profileid;
        choiceRequest.inquiries = inquiries;
        if (requestContext == null) {
            requestContext = this.getRequestContext();
        }
        choiceRequest.requestContext = requestContext;
        return choiceRequest;
    }

    getThriftBundleChoiceRequest() {
        let bundleRequest: any = Array();
        this.bundleChooseRequests.forEach(function (bundleChooseRequest: any) {
            let choiceInquiries: any = Array();
            bundleChooseRequest.forEach(function (request: any) {
                this.addRequest(request);
                let choiceInquiry: any = thrift_types.ChoiceInquiry;
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
        return thrift_types.ChoiceRequestBundle({ 'requests': bundleRequest });
    }

    protected choose(chooseAll: any = false, size: any = 0) {
        let response: any;
        if (chooseAll) {
            let bundleResponse: any = this.p13nchooseAll(this.getThriftBundleChoiceRequest());
            let variants: any = Array();
            bundleResponse.responses.forEach(function (choiceResponse: any) {
                variants = variants.concat(choiceResponse.variants);
            });
            response = thrift_types.ChoiceResponse({ 'variants': variants });
        } else {
            response = this.p13nchoose(this.getThriftChoiceRequest(size));
            if (size > 0) {
                response.variants = this.chooseResponses.variants.concat(response.variants);
            }
        }
        this.chooseResponses = response;
    }

    flushResponses() {
        this.autocompleteResponses = null;
        this.chooseResponses = null;
    }

    getResponse(chooseAll = false) {
        let _chResponseSize: any = 0
        if (this.chooseResponses !== null) {
            _chResponseSize = this.chooseResponses.variants.length;
        }
        let size: any = this.chooseRequests.length - _chResponseSize;
        if (this.chooseResponses == null) {
            this.choose(chooseAll);
        } else if (size) {
            this.choose(chooseAll, size);
        }
        let bxChooseResponseData = new bxChooseResponse.BxChooseResponse(this.chooseResponses, this.chooseRequests);
        bxChooseResponseData.setNotificationMode(this.getNotificationMode());
        return bxChooseResponseData;
    }

    getNotificationMode() {
        return (typeof (this.requestMap['dev_bx_notifications']) != "undefined" && this.requestMap['dev_bx_notifications'] !== null) && this.requestMap['dev_bx_notifications'] == 'true';
    }

    setAutocompleteRequest(request: any) {
        this.setAutocompleteRequests(Array(request));
    }

    setAutocompleteRequests(requests: any) {
        requests.forEach(function (request: any) {
            this.enhanceAutoCompleterequest(request);
        });
        this.autocompleteRequests = requests;
    }

    private enhanceAutoCompleterequest(request: any) {
        request.setDefaultIndexId(this.getAccount());
    }

    private p13nautocomplete(autocompleteRequest: any) {
        try {
            let choiceResponse: any = this.getP13n(this._timeout).autocomplete(autocompleteRequest);
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
        } catch (e) {
            this.throwCorrectP13nException(e);
        }
    }

    autocomplete() {
        let spval: any = this.getSessionAndProfile();
        let sessionid: any = spval[0];
        let profileid: any = spval[1];

        let userRecord: any = this.getUserRecord();
        let tempArray: any = this.autocompleteRequests;
        let p13nrequests: any = tempArray.map(function (this: any) {
            this.getAutocompleteThriftRequest(profileid, userRecord);
        });
        let i: any = -1;

        let tempArrayBxAuto: any = this.p13nautocompleteAll(p13nrequests)
        this.autocompleteResponses = tempArrayBxAuto.map(function (this: any) {
            this.autocompletePartail(this.request, ++i);
        });
    }

    getAutocompleteResponse() {
        let responses: any = this.getAutocompleteResponses();
        if (typeof (responses[0]) != "undefined" && responses[0] !== null) {
            return responses[0];
        }
        return null;
    }

    private p13nautocompleteAll(requests: any) {
        let requestBundle: any = thrift_types.AutocompleteRequestBundle;
        requestBundle.requests = requests;
        try {
            let choiceResponse = this.getP13n(this._timeout).autocompleteAll(requestBundle).responses;
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
        } catch (e) {
            this.throwCorrectP13nException(e);
        }
    }

    getAutocompleteResponses() {
        if (!this.autocompleteResponses) {
            this.autocomplete();
        }
        return this.autocompleteResponses;
    }

    setTimeout(timeout: any) {
        this._timeout = timeout;
        return this;
    }

    getDebugOutput() {
        return this.debugOutput;
    }

    setDebugOutputActive(debugOutputActive: any) {
        this.debugOutputActive = debugOutputActive;
    }

    notifyWarning(warning: any) {
        this.addNotification("warning", warning);
    }

    addNotification(type: any, notification: any) {
        if (this.notifications[type] === null) {
            this.notifications[type] = Array();
        }
        this.notifications[type].push(notification);
    }

    getNotifications() {
        let final: any = this.notifications;
        final['response'] = this.getResponse().getNotifications();
        return final;
    }

    finalNotificationCheck(force = false, requestMapKey = 'dev_bx_notifications') {
        if (force || ((typeof (this.requestMap[requestMapKey]) != "undefined" && this.requestMap[requestMapKey] !== null) && this.requestMap[requestMapKey] == 'true')) {
            let value: any = "<pre><h1>Notifications</h1>" + this.notifications.toString() + "</pre>";
            if (!this.debugOutputActive) {
                console.log(value);
                return;
            }
            return value;
        }
    }

}