let thrift_types = require('./bxthrift/p13n_types');
export class BxFilter {
	protected fieldName: any;
	protected values: any;
	protected negative: any;
	protected hierarchyId: any = null;
	protected hierarchy: any = null;
	protected rangeFrom: any = null;
	protected rangeTo: any = null;

	constructor(fieldName: any, values: any = Array(), negative: any = false) {
		this.fieldName = fieldName;
		this.values = values;
		this.negative = negative;
	}

	getFieldName() {
		return this.fieldName;
	}

	getValues() {
		return this.values;
	}

	isNegative() {
		return this.negative;
	}

	getHierarchyId() {
		return this.hierarchyId;
	}

	setHierarchyId(hierarchyId: any) {
		this.hierarchyId = hierarchyId;
	}

	getHierarchy() {
		return this.hierarchy;
	}

	setHierarchy(hierarchy: any) {
		this.hierarchy = hierarchy;
	}

	getRangeFrom() {
		return this.rangeFrom;
	}

	setRangeFrom(rangeFrom: any) {
		this.rangeFrom = rangeFrom;
	}

	getRangeTo() {
		return this.rangeTo;
	}

	setRangeTo(rangeTo: any) {
		this.rangeTo = rangeTo;
	}

	getThriftFilter() {
		let filter: any = new thrift_types.Filter()
		filter.fieldName = this.fieldName;
		filter.negative = this.negative;
		filter.stringValues = this.values;
		if (this.hierarchyId) {
			filter.hierarchyId = this.hierarchyId;
		}
		if (this.hierarchy) {
			filter.hierarchy = this.hierarchy;
		}
		if (this.rangeFrom) {
			filter.rangeFrom = this.rangeFrom;
		}
		if (this.rangeTo) {
			filter.rangeTo = this.rangeTo;
		}
		return filter;
	}
}