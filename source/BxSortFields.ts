let  thrift_types = require('./bxthrift/p13n_types');

export class BxSortFields {
    private sorts: any = Array();
    constructor(field = null, reverse = false) {
        if (field) {
            this.push(field, reverse);
        }
    }
    /**
     * @param field name od field to sort by (i.e. discountedPrice / title)
     * @param reverse true for ASC, false for DESC
     */
    push(field: any, reverse: any = false) {
        this.sorts[field] = reverse;
    }
    getSortFields() {
        return this.Array_keys(this.sorts);
    }
    Array_keys(input: any) {
        let output = new Array();
        let counter = 0;
        for (let i in input) {
            output[counter++] = i;
        }
        return output;
    }
    isFieldReverse(field: any) {
        if ((typeof (this.sorts[field]) != "undefined" && this.sorts[field] !== null) && this.sorts[field]) {
            return true;
        }
        return false;
    }

    getThriftSortFields() {
        let sortFields: any = Array();
        let tempSortFields: any = this.getSortFields();
        tempSortFields.forEach(function (field: any) {
            sortFields.push(thrift_types.SortField({ 'fieldName': field, 'reverse': this.isFieldReverse(field) }))
        });
        return sortFields;
    }
}