import {BxFacets} from "./BxFacets";
import {BxSortFields} from "./BxSortFields";
let  thrift_types = require('./bxthrift/p13n_types');

export class BxRequest {
	protected language: string;
	protected groupBy: string;
	protected choiceId: string;
	protected min: number;
	protected max: number;
	protected withRelaxation: boolean= false;

	protected indexId: string = "";
	protected requestMap: any = null;
	protected returnFields: any = Array();
	protected offset: number = 0;
	protected queryText: string = "";
	protected bxFacets: any = null;
	protected bxSortFields: any = null;
	protected bxFilters: any = Array();
	protected orFilters: boolean = false;
	protected hitsGroupsAsHits: any = null;
	protected groupFacets: any = null;
	protected requestContextParameters: any = Array();

	constructor(language: string, choiceId: string, max: number = 10, min: number = 0) {
		if (choiceId == '') {
			throw new Error('BxRequest created with null choiceId');
		}
		this.language = language;
		this.choiceId = choiceId;
		this.min = min;
		this.max = max;
		if (this.max == 0) {
			this.max = 1;
		}
		this.withRelaxation = choiceId == 'search';
	}

	getWithRelaxation() {
		return this.withRelaxation;
	}

	setWithRelaxation(withRelaxation: boolean) {
		this.withRelaxation = withRelaxation;
	}

	getReturnFields() {
		return this.returnFields;
	}

	setReturnFields(returnFields: any) {
		this.returnFields = returnFields;
	}

	getOffset() {
		return this.offset;
	}

	setOffset(offset: number) {
		this.offset = offset;
	}

	getQuerytext() {
		return this.queryText;
	}

	setQuerytext(queryText: string) {
		this.queryText = queryText;
	}

	getFacets() {
		return this.bxFacets;
	}

	setFacets(bxFacets: any) {
		this.bxFacets = bxFacets;
	}

	getSortFields() {
		return this.bxSortFields;
	}

	setSortFields(bxSortFields: any) {
		this.bxSortFields = bxSortFields;
	}

	getFilters() {
		let filters = this.bxFilters;
		if (this.getFacets()) {
			let tempFilters = this.getFacets().getFilters();
			tempFilters.forEach(function (filter: any) {
				filters.push(filter);
			});
		}
		return this.bxFilters;
	}

	setFilters(bxFilters: any) {
		this.bxFilters = bxFilters;
	}

	addFilter(bxFilter: any) {
		this.bxFilters[bxFilter.getFieldName()] = bxFilter;
	}

	getOrFilters() {
		return this.orFilters;
	}

	setOrFilters(orFilters: any) {
		this.orFilters = orFilters;
	}

	addSortField(field: string, reverse: boolean = false) {
		if (this.bxSortFields == null) {
			this.bxSortFields = new BxSortFields();
		}
		this.bxSortFields.push(field, reverse);
	}

	getChoiceId() {
		return this.choiceId;
	}

	setChoiceId(choiceId: any) {
		this.choiceId = choiceId;
	}

	getMax() {
		return this.max;
	}

	setMax(max: number) {
		this.max = max;
	}
	getMin() {
		return this.min;
	}

	setMin(min: number) {
		this.min = min;
	}
	getIndexId() {
		return this.indexId;
	}

	setIndexId(indexId: string) {
		this.indexId = indexId;
		let that:any=this;
		this.contextItems.forEach(function (v:any,k: any) {
			let contextItem: any = that.contextItems[k];
			if (contextItem.indexId == "" || contextItem.indexId == null) {
                that.contextItems[k].indexId = indexId;
			}
		});
	}

	setDefaultIndexId(indexId: string) {
		if (this.indexId == "") {
			this.setIndexId(indexId);
		}
	}

	setDefaultRequestMap(requestMap: any) {
		if (this.requestMap == null) {
			this.requestMap = requestMap;
		}
	}
	getLanguage() {
		return this.language;
	}

	setLanguage(language: string) {
		this.language = language;
	}
	getGroupBy() {
		return this.groupBy;
	}
	setGroupBy(groupBy: string) {
		this.groupBy = groupBy;
	}
	setHitsGroupsAsHits(groupsAsHits: any) {
		this.hitsGroupsAsHits = groupsAsHits;
	}
	setGroupFacets(groupFacets: any) {
		this.groupFacets = groupFacets;
	}
	getSimpleSearchQuery() {
		let searchQuery = new thrift_types.SimpleSearchQuery();
		searchQuery.indexId = this.getIndexId();
		searchQuery.language = this.getLanguage();
		searchQuery.returnFields = this.getReturnFields();
		searchQuery.offset = this.getOffset();
		searchQuery.hitCount = this.getMax();
		searchQuery.queryText = this.getQuerytext();
		searchQuery.groupFacets = (this.groupFacets === null) ? false : this.groupFacets;
		searchQuery.groupBy = this.groupBy;
		if (this.hitsGroupsAsHits !== null) {
			searchQuery.hitsGroupsAsHits = this.hitsGroupsAsHits;
		}
		if (Object.keys(this.getFilters()).length > 0) {
			searchQuery.filters = Array();
			let requestFilters=this.getFilters();
			for(let i in requestFilters)
			{
				let filter=requestFilters[i];
                searchQuery.filters.push(filter.getThriftFilter());
			}

		}
		searchQuery.orFilters = this.getOrFilters();
		if (this.getFacets()) {
			searchQuery.facetRequests = this.getFacets().getThriftFacets();
		}
		if (this.getSortFields()) {
			searchQuery.sortFields = this.getSortFields().getThriftSortFields();
		}
		return searchQuery;
	}

	protected contextItems = Array();
	setProductContext(fieldName: string, contextItemId: string, role: string = 'mainProduct', relatedProducts: any = Array(), relatedProductField: string = 'id') {
		let contextItem: any = new  thrift_types.ContextItem();
		contextItem.indexId = this.getIndexId();
		contextItem.fieldName = fieldName;
		contextItem.contextItemId = contextItemId;
		contextItem.role = role;
		this.contextItems.push(contextItem);
		this.addRelatedProducts(relatedProducts, relatedProductField);
	}
	setBasketProductWithPrices(fieldName: string, basketContent: any, role: string = 'mainProduct', subRole: string = 'subProduct', relatedProducts: any = Array(), relatedProductField: string = 'id') {
		if (basketContent !== false && basketContent.count) {

			// Sort basket content by price
			basketContent.sort(function (a: any, b: any) {
				if (a['price'] > b['price']) {
					return -1;
				} else if (b['price'] > a['price']) {
					return 1;
				}
				return 0;
			});
			let basketItem = basketContent.shift();
			let contextItem = new thrift_types.ContextItem();
			contextItem.indexId = this.getIndexId();
			contextItem.fieldName = fieldName;
			contextItem.contextItemId = basketItem['id'];
			contextItem.role = role;
			this.contextItems.push(contextItem);
			basketContent.forEach(function(basketItem:any){
				contextItem = new thrift_types.ContextItem();
				contextItem.indexId = this.getIndexId();
				contextItem.fieldName = fieldName;
				contextItem.contextItemId = basketItem['id'];
				contextItem.role = subRole;
				this.contextItems.push(contextItem);
			});
		}
		this.addRelatedProducts(relatedProducts, relatedProductField);
	}
	addRelatedProducts(relatedProducts: any, relatedProductField: string = 'id') {
		for (let productId in relatedProducts) {
			let related: any = relatedProducts[productId];
			let key: any = "bx_" + this.choiceId + "_" + productId;
			this.requestContextParameters[key] = related;
		}
	}

	getContextItems() {
		return this.contextItems;
	}

	getRequestContextParameters() {
		return this.requestContextParameters;
	}

	retrieveHitFieldValues(item: any, field: string, items: any, fields: any) {
		return Array();
	}
}