let  thrift_types = require('./bxthrift/p13n_types');
class BxFilter
{
	protected fieldName: string;
	protected values: string[];
	protected negative: boolean;
	protected hierarchyId: string = "";
	protected hierarchy: string = "";
	protected rangeFrom: string = "";
	protected rangeTo: string = "";
	
	constructor(fieldName: string, values: string[]=Array(), negative: boolean = false) {
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
	
	setHierarchyId(hierarchyId: string) {
		this.hierarchyId = hierarchyId;
	}
	
	getHierarchy() {
		return this.hierarchy;
	}
	
	setHierarchy(hierarchy: string) {
		this.hierarchy = hierarchy;
	}
	
	getRangeFrom() {
		return this.rangeFrom;
	}
	
	setRangeFrom(rangeFrom: string) {
		this.rangeFrom = rangeFrom;
	}
	
	getRangeTo() {
		return this.rangeTo;
	}
	
	setRangeTo(rangeTo: string) {
		this.rangeTo = rangeTo;
	}
	
	getThriftFilter() {
		let filter: any =new thrift_types.Filter()
        filter.fieldName = this.fieldName;
        filter.negative = this.negative;
        filter.stringValues = this.values;
		if(this.hierarchyId) {
			filter.hierarchyId = this.hierarchyId;
		}
		if(this.hierarchy) {
			filter.hierarchy = this.hierarchy;
		}
		if(this.rangeFrom) {
			filter.rangeFrom = this.rangeFrom;
		}
		if(this.rangeTo) {
			filter.rangeTo = this.rangeTo;
		}
        return filter;
	}
}