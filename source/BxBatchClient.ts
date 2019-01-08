import {BxBatchRequest} from './BxBatchRequest'
import {BxBatchResponse} from './BxBatchResponse';
var thrift_types = require('./bxthrift/p13n_types.js');
var thrift_P13nService = require('./bxthrift/P13nService.js');
var thrift = require('thrift-http');
var btoa = require('btoa');
var secureRandom = require('securerandom');
export class BxBatchClient {

    private account: string;
    private password: string;
    private domain: string;
    private isDev: boolean;
    protected apiKey:any  = null;
    protected apiSecret :any = null;
    private host: string;
    private uri: string;
    protected schema = 'https';
    protected batchSize: number = 1000;
    protected notifications:any = [];
    protected requestContextParameters:any = [];
    protected batchChooseRequests:any = [];
    protected batchChooseRequest :any = [];

    private port: number;
    protected isTest :any = null;
    protected batchChooseResponse :any = [];
    private p13n_username: string;
    private p13n_password: string;
    protected transport :any = null;
    protected batchRequest :any = [];

    protected _timeout: any;

    constructor(account:any, password:any, domain:any, isDev:boolean=false, apiKey:any=null, apiSecret:any=null) {
        this.account = account
        this.password = password
        this.domain = domain
        this.isDev = isDev
        this.apiKey = apiKey
        this.apiSecret = apiSecret

        this.host = "track.bx-cloud.com/track"
        this.uri = '/p13n.web/p13n'
        this.schema = 'https'
        this.batchSize =1000
        this.notifications = [];
        this.requestContextParameters = [];
        this.batchChooseRequests = [];
    }

    setRequest(request: any) {
        request.setDefaultIndexId(this.getAccount(this.isDev));
        request.setRequestContextParameters(this.requestContextParameters);
        request.setIsDev(this.isDev);
        this.batchRequest = request;
    }

    async getBatchChooseResponse() {
        let _batchChooseResponseSize = 0;
        if (this.batchChooseResponse.length > 0) {
            _batchChooseResponseSize = this.batchChooseResponse.variants.size;
        }
        if ((this.batchChooseResponse == null || this.batchChooseResponse.length < 1 ) == true) {
            this.batchChooseResponse = await this.batchChoose();
        }
        let bxBatchChooseResponse =  new BxBatchResponse(this.batchChooseResponse, this.batchRequest.getProfileIds());
        return bxBatchChooseResponse
    }

    async batchChoose() {
        let TmpReturn :any;
        let requests = this.getThriftBatchChoiceRequest()
        if (Array.isArray(requests)) {
            let variants = Array()
            let selectedVariants = Array()
            //it means that the batch size has been exceeded

            requests.forEach(function(request:any){
                let response = this.p13nBatch(request)
                response.variants.forEach(function(variant: any){
                    variants.push(variant)
                })

                response.selectedVariants.forEach(function(selectedVariant: any){
                    selectedVariants.push(selectedVariant)
                })

            })

            let batchChooseResponse = new thrift_types.BatchChoiceResponse([{"variant":variants}, {'selectedVariants' : selectedVariants}])
            TmpReturn = batchChooseResponse
        }

        let batchChooseResponse = await this.p13nBatch(requests);
        TmpReturn = batchChooseResponse;
        return TmpReturn
    }


    getThriftBatchChoiceRequest() {
        let TmpReturn :any;
        let requestProfiles = this.batchRequest.getProfileIds();
        if (requestProfiles.length > this.batchSize) {
            let tempArr : any = Array();
            let i = 1;
            let obj = this;
            requestProfiles.forEach(function(groupProfileIds : any){
                tempArr.push(groupProfileIds);
                if(i%this.batchSize == 0) {
                    let request = obj.getBatchChooseRequest(obj.batchRequest, tempArr);
                    obj.addBatchChooseRequest(request);
                    tempArr.splice(0, requestProfiles.length);
                }
                if(requestProfiles.length == i && i%this.batchSize != 0)
                {
                    let request = obj.getBatchChooseRequest(obj.batchRequest, tempArr);
                    obj.addBatchChooseRequest(request);
                    tempArr.splice(0, requestProfiles.length);
                }

                i++;

            })

            TmpReturn = this.batchChooseRequests
        }

        let batchChooseRequest = this.getBatchChooseRequest(this.batchRequest);
        TmpReturn = batchChooseRequest
        return TmpReturn;
    }

    addBatchChooseRequest(request: any) {
        if (this.batchChooseRequests == null || this.batchChooseRequests.length < 1) {
            this.batchChooseRequests = Array();
        }
        this.batchChooseRequests.push(request);
    }

    getBatchChooseRequest(request:any, profileIds: any =[]) {
        let batchRequest = new thrift_types.BatchChoiceRequest();
        batchRequest.userRecord = this.getUserRecord();
        batchRequest.profileIds = [this.getAccount()];
        batchRequest.choiceInquiry = new thrift_types.ChoiceInquiry();
        batchRequest.requestContext = new thrift_types.RequestContext();
        batchRequest.profileContexts = request.getProfileContextList(profileIds);
        batchRequest.choiceInquiries = request.getChoiceInquiryList();
        return batchRequest;
    }

    public async p13nBatch(batchChoiceRequest:any) {
        try {
            let p1n = await this.getP13n();
            let batchChooseResponse  =  p1n.batchChoose(batchChoiceRequest);
            if (this.requestContextParameters != null) {
                if ((typeof (this.requestContextParameters['dev_bx_disp']) != "undefined" && this.requestContextParameters['dev_bx_disp'] !== null) && this.requestContextParameters['dev_bx_disp'] == 'true') {
                    let debug: any = true;
                    if ((typeof (this.requestContextParameters['dev_bx_choice']) != "undefined" && this.requestContextParameters['dev_bx_choice'] !== null)) {
                        debug = false;
                        let obj = this;
                        batchChoiceRequest.inquiries.forEach(function (inquiry: any) {
                            if (inquiry.choiceId == obj.requestContextParameters['dev_bx_choice']) {
                                debug = true;
                                return;
                            }
                        });
                    }
                    if (debug) {
                        let debugOutput = "<pre><h1>Choice Request</h1>" + batchChoiceRequest.toString() + "<br><h1>Choice Response</h1>" + batchChooseResponse.toString() + "</pre>";
                        console.log(debugOutput);
                        return;

                    }
                }
                if ((typeof (this.requestContextParameters['dev_bx_debug']) != "undefined" && this.requestContextParameters['dev_bx_debug'] !== null) && this.requestContextParameters['dev_bx_debug'] == 'true') {
                    this.addNotification('bxRequest', batchChoiceRequest);
                    this.addNotification('bxResponse', batchChooseResponse);
                }

            }
            return batchChooseResponse
        }
        catch (e) {
            this.throwCorrectP13nException(e);
        }
    }

    getP13n()
    {
        if(this.transport == null) {
            if (this.apiKey == null || this.apiSecret == null)
            {
                this.host = "api.bx-cloud.com";
                this.apiKey = "boxalino";
                this.apiSecret = "tkZ8EXfzeZc6SdXZntCU";
            }
        }
        var connection= thrift.createHttpConnection(this.host, "443", {
            transport: thrift.TBufferedTransport,
            protocol: thrift.TCompactProtocol,
            path: this.uri,
            https : true,
            headers:{
                "Accept": "application/x-thrift",
                "Content-Type": "application/x-thrift",
                "Authorization": "Basic " + btoa(this.apiKey + ":" + this.apiSecret)
            },
        });
        var client = new thrift.createHttpClient(thrift_P13nService, connection);
        return client;
    }

    getUserRecord()
    {
        let userRecord= new thrift_types.UserRecord();
        userRecord.username = this.getAccount(this.isDev);
        userRecord.apiKey = this.getApiKey();
        userRecord.apiSecret = this.getApiSecret()
        return userRecord;
    }

    resetBatchRequests()
    {
        this.batchChooseRequests = Array();
    }

    flushResponses()
    {
        this.batchChooseResponse = null
    }

    //duplicate from BxClient.rb
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
            throw new Error("Configuration not live on account " + this.getAccount() + ": choice " + choiceId +" doesn't exist. NB: If you get a message indicating that the choice doesn't exist, go to http://intelligence.bx-cloud.com, log in your account and make sure that the choice id you want to use is published.");
        }
        if (e.toString().indexOf('Solr returned status 404') !== false) {
            throw new Error("Data not live on account " + this.getAccount() + ": index returns status 404. Please publish your data first, like in example backend_data_basic.php.");
        }
        if (e.toString().indexOf('undefined field') !== false) {
            let parts: any = e.message.split('undefined field');
            pieces = parts[1].split('	at ');
            let field = pieces[0].replace(':', '');
            throw new Error("You request in your filter or facets a non-existing field of your account " + this.getAccount() + ": field " + field + " doesn't exist.");
        }
        if (e.toString().indexOf('All choice variants are excluded') !== false) {
            throw new Error("You have an invalid configuration for with a choice defined, but having no defined strategies. This is a quite unusual case, please contact support@boxalino.com to get support.");
        }
        throw e;
    }

    addRequestContextParameter(name:any, values:any)
    {
        if (!Array.isArray(values)) {
            values = Array([values]);
        }
        this.requestContextParameters[name] = values;
    }

    resetRequestContextParameter()
    {
        this.requestContextParameters = Array();
    }

    setTimeout(timeout: any)
    {
        this._timeout = timeout;
    }

    setHost(host: any){
        this.host = host;
    }

    setTestMode(isTest: any){
        this.isTest  = isTest;
    }

    setApiKey(apiKey:any){
        this.apiKey= apiKey;
    }

    setApiSecret(apiSecret : any) {
        this.apiSecret = apiSecret;
    }

    getAccount(checkDev :boolean= true) {
        if (checkDev == true && this.isDev == true) {
            return this.account + '_dev';
        }
        return this.account;
    }

    getUsername() {
        return this.getAccount(false);
    }

    getPassword(){
        return this.password
    }

    getApiKey() {
        return this.apiKey;
    }

    getApiSecret() {
        return this.apiSecret;
    }

    addNotification(type: any, notification: any) {
        if (this.notifications[type] === null) {
            this.notifications[type] = Array();
        }
        this.notifications[type].push(notification);
    }
}