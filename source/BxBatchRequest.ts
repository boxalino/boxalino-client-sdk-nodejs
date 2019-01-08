import {BxRequest} from './BxRequest'
import {BxFacets} from './BxFacets';
import {BxSortFields} from './BxSortFields';
var thrift_types = require('./bxthrift/p13n_types.js');

import {BxClient} from "./BxClient";
export class BxBatchRequest extends BxRequest {

    protected language: string;
    protected choiceId: string;
    protected max: number = 10;
    protected min: number = 0;
    protected profileIds: any = [];
    protected choiceInquiryList: any = [];
    protected isTest: boolean= false;
    protected isDev: boolean= false;
    protected requestContextParameters: any = [];
    protected profileContextList: any = [];
    protected sameInquiry: boolean = true;

    constructor(language: string, choiceId : string, max: number = 10, min: number = 0) {
        super(language, choiceId, max, min);
        if(choiceId == null){
            throw new Error("BxBatchRequest created with null choiceId");
        }
        this.language = language;
        this.choiceId = choiceId;
        this.max = max;
        this.min = min;

        this.sameInquiry = true;
        this.requestContextParameters = [];
        this.profileContextList = [];
        this.profileIds = [];
        this.choiceInquiryList = [];
        //configurations from parent initialize
        this.bxFacets = new BxFacets();

        this.bxSortFields = new BxSortFields(); //Array.new
        this.bxFilters = [];
        this.orFilters = false;
        this.hitsGroupsAsHits = null;
        this.withRelaxation = choiceId == 'search';
        this.contextItems = [];
        this.returnFields = [];
    }

    getChoiceInquiryList(){
        if(this.profileIds.length < 1){
            return [];
        }
        //NOte TO COMMENTED
        //this.choiceInquiryList = [];
        if(this.sameInquiry == true) {
            let choiceInquiry = this.createMainInquiry();
            this.choiceInquiryList.push(choiceInquiry);
        }

        return this.choiceInquiryList
    }


    getProfileContextList(setOfProfileIds :any = Array()) {
        if (this.profileIds.length < 1 && setOfProfileIds.length <1)
        {
            return [];
        }

       // this.profileIds = setOfProfileIds;
        if (setOfProfileIds.length <1) {
            this.profileIds = this.getProfileIds()
        }

        this.profileContextList = [];
        let Obj = this;
        this.profileIds.forEach(function (id: any) {
            Obj.addProfileContext(id)
        });


        return this.profileContextList;
    }

    getSimpleSearchQuery() {
        let searchQuery = new thrift_types.SimpleSearchQuery();
        searchQuery.indexId = this.getIndexId();
        searchQuery.language = this.language;
        searchQuery.returnFields = this.getReturnFields();
        searchQuery.hitCount = this.max;
        searchQuery.queryText = this.getQuerytext();
        searchQuery.groupBy = this.getGroupBy();
        let _temp = this.getFilters();
        if (_temp != null) {
            if (_temp.length > 0) {
                searchQuery.filters = Array();
                this.getFilters().forEach(function(filter:any){
                    searchQuery.filters.push(filter[1].getThriftFilter)
                })
            }
        }
        searchQuery.orFilters = this.getOrFilters();
        if (this.getSortFields()) {
            searchQuery.sortFields = this.getSortFields().getThriftSortFields
        }
        return searchQuery
    }

    getRequestContext(id:any) {
        let requestContext = new thrift_types.RequestContext();
        requestContext.parameters = [];
        if (this.requestContextParameters != null && this.requestContextParameters.length > 0 ) {
            Object.keys(this.requestContextParameters).forEach(function(k){
                requestContext.parameters[k] = this.requestContextParameters[k];
            })
        }
        requestContext.parameters['customerId'] = [String(id)]
        return requestContext
    }

    createMainInquiry() {
        let choiceInquiry =  new thrift_types.ChoiceInquiry()
        choiceInquiry.choiceId = this.choiceId
        if (this.isTest == true || (this.isDev == true && this.isTest == null)) {
            choiceInquiry.choiceId = this.choiceId + "_debugtest"
        }
        choiceInquiry.simpleSearchQuery = this.getSimpleSearchQuery();
        choiceInquiry.contextItems = this.getContextItems();
        choiceInquiry.minHitCount = this.min;
        choiceInquiry.withRelaxation = this.getWithRelaxation();

        return choiceInquiry
    }

    addProfileContext(id : any, requestContext : any = null) {
        if (requestContext == null) {
            requestContext = this.getRequestContext(id);
        }
        let profileContext = new thrift_types.ProfileContext()
        profileContext.profileId = id;
        profileContext.requestContext = requestContext
        this.profileContextList.push(profileContext);
        return this.profileContextList;
    }

    addChoiceInquiry(newChoiceInquiry :any){
        this.choiceInquiryList.push(newChoiceInquiry);
        return this.choiceInquiryList
    }

    setUseSameChoiceInquiry(sameInquiry : any) {
        this.sameInquiry = sameInquiry
    }

    setProfileIds(ids: any) {
        this.profileIds = ids;
    }

    getProfileIds() {
        return this.profileIds;
    }

    getContextItems() {
        return this.contextItems;
    }

    setRequestContextParameters(requestParams: any) {
        this.requestContextParameters = requestParams;
    }

    setIsDev(dev: any) {
        this.isDev = dev;
    }


}