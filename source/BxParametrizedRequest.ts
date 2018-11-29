
import {BxRequest} from './BxRequest';
import {BxFacets} from './BxFacets';
import {BxSortFields} from './BxSortFields';
import {BxFilter} from './BxFilter';

export class BxParametrizedRequest extends BxRequest {
    private bxReturnFields: string[] = Array('id');
    private getItemFieldsCB: any = null;

    private requestParametersPrefix: string = "";
    private requestWeightedParametersPrefix: string = "bxrpw_";
    private requestFiltersPrefix: string = "bxfi_";
    private requestFacetsPrefix: string = "bxfa_";
    private requestSortFieldPrefix: string = "bxsf_";

    private requestReturnFieldsName: string = "bxrf";
    private requestContextItemFieldName: string = "bxcif";
    private requestContextItemFieldValues: string = "bxciv";
    private callBackCache: any = null;
    protected requestParameterExclusionPatterns = Array();

    constructor(language: string, choiceId: string, max: number = 10, min: number = 0, bxReturnFields: any = null, getItemFieldsCB: any = null) {
        super(language, choiceId, max, min);

        if (bxReturnFields != null) {
            this.bxReturnFields = bxReturnFields;
        }
        this.getItemFieldsCB = getItemFieldsCB;
    }

    setRequestParametersPrefix(requestParametersPrefix: string) {
        this.requestParametersPrefix = requestParametersPrefix;
    }

    getRequestParametersPrefix() {
        return this.requestParametersPrefix;
    }

    setRequestWeightedParametersPrefix(requestWeightedParametersPrefix: string) {
        this.requestWeightedParametersPrefix = requestWeightedParametersPrefix;
    }

    getRequestWeightedParametersPrefix() {
        return this.requestWeightedParametersPrefix;
    }

    setRequestFiltersPrefix(requestFiltersPrefix: string) {
        this.requestFiltersPrefix = requestFiltersPrefix;
    }

    getRequestFiltersPrefix() {
        return this.requestFiltersPrefix;
    }

    setRequestFacetsPrefix(requestFacetsPrefix: string) {
        this.requestFacetsPrefix = requestFacetsPrefix;
    }

    getRequestFacetsPrefix() {
        return this.requestFacetsPrefix;
    }

    setRequestSortFieldPrefix(requestSortFieldPrefix: string) {
        this.requestSortFieldPrefix = requestSortFieldPrefix;
    }

    getRequestSortFieldPrefix() {
        return this.requestSortFieldPrefix;
    }

    setRequestReturnFieldsName(requestReturnFieldsName: string) {
        this.requestReturnFieldsName = requestReturnFieldsName;
    }

    getRequestReturnFieldsName() {
        return this.requestReturnFieldsName;
    }

    setRequestContextItemFieldName(requestContextItemFieldName: string) {
        this.requestContextItemFieldName = requestContextItemFieldName;
    }

    getRequestContextItemFieldName() {
        return this.requestContextItemFieldName;
    }

    setRequestContextItemFieldValues(requestContextItemFieldValues: string) {
        this.requestContextItemFieldValues = requestContextItemFieldValues;
    }

    getRequestContextItemFieldValues() {
        return this.requestContextItemFieldValues;
    }

    getPrefixes() {
        return Array(this.requestParametersPrefix, this.requestWeightedParametersPrefix, this.requestFiltersPrefix, this.requestFacetsPrefix, this.requestSortFieldPrefix);
    }

    matchesPrefix(string: string, prefix: string, checkOtherPrefixes: boolean = true) {
        if (checkOtherPrefixes) {
            this.getPrefixes().forEach(function (p: any) {
                if (p == prefix) {
                    return true;
                }
                if (prefix.length < p.length && string.indexOf(p) === 0) {
                    return false;
                }
            })
        }
        return prefix == null || string.indexOf(prefix) === 0;
    }

    getPrefixedParameters(prefix: string, checkOtherPrefixes: boolean = true) {
        let params: any = Array();
        if (Array.isArray(this.requestMap) === false) {
            return Array();
        }
        this.requestMap.forEach(function (k: any) {
            let v = this.requestMap[k];
            if (this.matchesPrefix(k, prefix, checkOtherPrefixes)) {
                params[k.substring(prefix.length)] = v;
            }
        });
        return params;
    }

    getContextItems() {
        let contextItemFieldName: any = null;
        let contextItemFieldValues: any = Array();
        let params: any = this.getPrefixedParameters(this.requestParametersPrefix, false);
        params.forEach(function (name: string) {
            let values = params[name];
            let value: string;
            if (name == this.requestContextItemFieldName) {
                value = values;
                if (Array.isArray(value) && value.length > 0) {
                    value = values[0];
                }
                contextItemFieldName = value;
                return;
            } if (name == this.requestContextItemFieldValues) {
                value = values;
                if (!Array.isArray(value)) {
                    value = values.split(',');
                }
                contextItemFieldValues = value;
                return;
            }
            params[name] = values;
        });
        if (contextItemFieldName) {
            contextItemFieldValues.forEach(function (contextItemFieldValue: string) {
                this.setProductContext(contextItemFieldName, contextItemFieldValue);
            });
        }
        return super.getContextItems();
    }

    getRequestParameterExclusionPatterns() {
        return this.requestParameterExclusionPatterns;
    }

    addRequestParameterExclusionPatterns(pattern: string) {
        this.requestParameterExclusionPatterns.push(pattern);
    }

    getRequestContextParameters() {
        let params: any = Array();
        this.getPrefixedParameters(this.requestWeightedParametersPrefix).forEach(function (name: any) {
            let values = this.getPrefixedParameters(this.requestWeightedParametersPrefix)[name];
            params[name] = values;
        });
        this.getPrefixedParameters(this.requestParametersPrefix, false).forEach(function (name: any) {
            let values: any = this.getPrefixedParameters(this.requestParametersPrefix, false)[name];
            if (name.indexOf(this.requestWeightedParametersPrefix) !== false) {
                return;
            }
            if (name.indexOf(this.requestFiltersPrefix) !== false) {
                return;
            }
            if (name.indexOf(this.requestFacetsPrefix) !== false) {
                return;
            }
            if (name.indexOf(this.requestSortFieldPrefix) !== false) {
                return;
            }
            if (name == this.requestReturnFieldsName) {
                return;
            }
            params[name] = values;
        });
        params = this.unset(params, 'bxi_data_owner_expert');
        return params;
    }

    getWeightedParameters() {
        let params: any = Array();
        this.getPrefixedParameters(this.requestWeightedParametersPrefix).forEach(function (name: any) {
            let values = this.getPrefixedParameters(this.requestWeightedParametersPrefix)[name];
            let pieces: any = name.split('_');
            let fieldValue: any = "";
            if (pieces.length > 0) {
                fieldValue = pieces[pieces.length - 1];
                this.unset(pieces, [pieces.length - 1]);
            }
            let fieldName: any = pieces.join('_');
            if (params[fieldName] === null) {
                params[fieldName] = Array();
            }
            params[fieldName][fieldValue] = values;
        });
        return params;
    }

    getFilters() {
        let filters: any = super.getFilters();
        this.getPrefixedParameters(this.requestFiltersPrefix).forEach(function (fieldName: any) {
            let value = this.getPrefixedParameters(this.requestFiltersPrefix)[fieldName];
            let negative: any = false;
            if (value.indexOf('!') === 0) {
                negative = true;
                value = value.substr(1);
            }
            filters.push(new BxFilter(fieldName, Array(value), negative));
        });
        return filters;
    }

    getFacets() {
        let facets: any = super.getFacets();
        if (facets == null) {
            facets = new BxFacets();
        }
        this.getPrefixedParameters(this.requestFacetsPrefix).forEach(function (fieldName: any) {
            let selectedValue = this.getPrefixedParameters(this.requestFacetsPrefix)[fieldName];
            facets.addFacet(fieldName, selectedValue);
        });
        return facets;
    }

    getSortFields() {
        let sortFields: any = super.getSortFields();
        if (sortFields == null) {
            sortFields = new BxSortFields();
        }
        this.getPrefixedParameters(this.requestSortFieldPrefix).forEach(function (name: any) {
            let value = this.getPrefixedParameters(this.requestSortFieldPrefix)[name];
            sortFields.push(name, value);
        });
        return sortFields;
    }

    getReturnFields() {
        var unique = (super.getReturnFields().concat(this.bxReturnFields)).filter(this.array_unique);
        return unique;
    }
    array_unique(value: string, index: number, self: any) {
        return self.indexOf(value) === index;
    }
    getAllReturnFields() {
        let returnFields: any = this.getReturnFields();
        if (typeof (this.requestMap[this.requestReturnFieldsName]) != "undefined" && this.requestMap[this.requestReturnFieldsName] !== null) {
            returnFields = (returnFields.concat(this.requestMap[this.requestReturnFieldsName].split(',')).filter(this.array_unique));
        }
        return returnFields;
    }


    retrieveFromCallBack(items: any, fields: any) {
        if (this.callBackCache === null) {
            this.callBackCache = Array();
            let ids: any = Array();
            items.forEach(function (item: any) {
                ids.push(item.values['id'][0]);
            });
        }
        return this.callBackCache;
    }

    retrieveHitFieldValues(item: any, field: any, items: any, fields: any) {
        let itemFields: any = this.retrieveFromCallBack(items, fields);
        if (typeof (itemFields[item.values['id'][0]][field]) != "undefined" && itemFields[item.values['id'][0]][field] !== null) {
            return itemFields[item.values['id'][0]][field];
        }
        return super.retrieveHitFieldValues(item, field, items, fields);
    }

    private unset(myArray: any, key: string) {
        const index = myArray.indexOf(key, 0);
        if (index > -1) {
            myArray.splice(index, 1);
        }
        return myArray;
    }
}
