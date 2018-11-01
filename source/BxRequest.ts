import * as bxFacets from "./BxFacets";
import * as bxSortFields from "./BxSortFields";
let  thrift_types = require('./bxthrift/p13n_types');
export class BxRequest {
	protected language: any;
	protected groupBy: any;
	protected choiceId: any;
	protected min: any;
	protected max: any;
	protected withRelaxation: any;

	protected indexId: any = null;
	protected requestMap: any = null;
	protected returnFields: any = Array();
	protected offset: any = 0;
	protected queryText: any = "";
	protected bxFacets: any = new bxFacets.BxFacets();
	protected bxSortFields: any = new bxSortFields.BxSortFields();
	protected bxFilters: any = Array();
	protected orFilters: any = false;
	protected hitsGroupsAsHits: any = null;
	protected groupFacets: any = null;
	protected requestContextParameters: any = Array();

	constructor(language: any, choiceId: any, max: any = 10, min: any = 0) {
		if (choiceId == '') {
			throw new Error('BxRequest created with null choiceId');
		}
		this.language = language;
		this.choiceId = choiceId;
		this.min = parseFloat(min);
		this.max = parseFloat(max);
		if (this.max == 0) {
			this.max = 1;
		}
		this.withRelaxation = choiceId == 'search';
	}

	getWithRelaxation() {
		return this.withRelaxation;
	}

	setWithRelaxation(withRelaxation: any) {
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

	setOffset(offset: any) {
		this.offset = offset;
	}

	getQuerytext() {
		return this.queryText;
	}

	setQuerytext(queryText: any) {
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

	addSortField(field: any, reverse: any = false) {
		if (this.bxSortFields == null) {
			this.bxSortFields = new bxSortFields.BxSortFields();
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

	setMax(max: any) {
		this.max = max;
	}
	getMin() {
		return this.min;
	}

	setMin(min: any) {
		this.min = min;
	}
	getIndexId() {
		return this.indexId;
	}

	setIndexId(indexId: any) {
		this.indexId = indexId;
		this.contextItems.forEach(function (k: any) {
			let contextItem: any = this.contextItems[k];
			if (contextItem.indexId == null) {
				this.contextItems[k].indexId = indexId;
			}
		});
	}

	setDefaultIndexId(indexId: any) {
		if (this.indexId == null) {
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

	setLanguage(language: any) {
		this.language = language;
	}
	getGroupBy() {
		return this.groupBy;
	}
	setGroupBy(groupBy: any) {
		this.groupBy = groupBy;
	}
	setHitsGroupsAsHits(groupsAsHits: any) {
		this.hitsGroupsAsHits = groupsAsHits;
	}
	setGroupFacets(groupFacets: any) {
		this.groupFacets = groupFacets;
	}
	getSimpleSearchQuery() {
		let searchQuery = thrift_types.SimpleSearchQuery;
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
		if (this.getFilters().length > 0) {
			searchQuery.filters = Array();
			this.getFilters().forEach(function (filter: any) {
				searchQuery.filters.push(filter.getThriftFilter());
			});
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
	setProductContext(fieldName: any, contextItemId: any, role: any = 'mainProduct', relatedProducts: any = Array(), relatedProductField: any = 'id') {
		let contextItem: any = thrift_types.ContextItem;
		contextItem.indexId = this.getIndexId();
		contextItem.fieldName = fieldName;
		contextItem.contextItemId = contextItemId;
		contextItem.role = role;
		this.contextItems.push(contextItem);
		this.addRelatedProducts(relatedProducts, relatedProductField);
	}
	setBasketProductWithPrices(fieldName: any, basketContent: any, role: any = 'mainProduct', subRole: any = 'subProduct', relatedProducts: any = Array(), relatedProductField: any = 'id') {
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
			let contextItem = thrift_types.ContextItem;
			contextItem.indexId = this.getIndexId();
			contextItem.fieldName = fieldName;
			contextItem.contextItemId = basketItem['id'];
			contextItem.role = role;
			this.contextItems.push(contextItem);
			basketContent.forEach(function(basketItem:any){
				contextItem = thrift_types.ContextItem;
				contextItem.indexId = this.getIndexId();
				contextItem.fieldName = fieldName;
				contextItem.contextItemId = basketItem['id'];
				contextItem.role = subRole;
				this.contextItems.push(contextItem);
			});
		}
		this.addRelatedProducts(relatedProducts, relatedProductField);
	}
	addRelatedProducts(relatedProducts: any, relatedProductField: any = 'id') {
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

	retrieveHitFieldValues(item: any, field: any, items: any, fields: any) {
		return Array();
	}
}