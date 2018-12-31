var thrift_types = require('./bxthrift/p13n_types.js');
import {BxFacets} from "./BxFacets";

export class BxChooseResponse {
    private response: any;
    private bxRequests: any;
    private notifications: any = Array();

    constructor(response: any, _bxRequests: any = Array()) {
        this.response = response;
        this.bxRequests = Array.isArray(_bxRequests) ? _bxRequests : Array(_bxRequests);
    }

    protected notificationLog = Array();
    protected notificationMode = false;

    setNotificationMode(mode: any) {
        this.notificationMode = mode;
        this.bxRequests.forEach(function (bxRequest: any) {
            let facet = bxRequest.getFacets();
            if (facet !== null) {
                facet.setNotificationMode(mode);
            }
        });
    }

    getNotificationMode() {
        return this.notificationMode;
    }

    addNotification(name: any, parameters: any) {
        if (this.notificationMode) {
            this.notifications.push(Array({'name': name, 'parameters': parameters}));
        }
    }

    getNotifications() {
        let finalNotifications: any = this.notifications;
        this.bxRequests.forEach(function (bxRequest: any) {
            finalNotifications.push(Array({'name': 'bxFacet', 'parameters': this.bxRequest.getChoiceId()}));
            let facets: any = bxRequest.getFacets();
            if (facets != null) {
                let notify = facets.getNotifications();
                notify.forEach(function (notification: any) {
                    finalNotifications.push(notification);
                });
            }
        });
        return finalNotifications;
    }

    getResponse() {
        return this.response;
    }

    getChoiceResponseVariant(choice = null, count = 0) {
        for (let k in this.bxRequests) {
            let bxRequest: any = this.bxRequests[k];
            if (choice == null || choice == bxRequest.getChoiceId()) {
                if (count > 0) {
                    count--;
                    continue;
                }
                return this.getChoiceIdResponseVariant(k);
            }
        }
    }

    getChoiceIdFromVariantIndex(variant_index: any) {
        return (typeof (this.bxRequests[variant_index]) != "undefined" && this.bxRequests[variant_index] !== null) ? this.bxRequests[variant_index].getChoiceId() : null;
    }


    protected getChoiceIdResponseVariant(id: any = 0) {
        let response: any = this.getResponse();

        if(response != null && response != '' ) {
            if ( response.variants != null  && response.variants != ''){
                if(typeof (response.variants[id]) != "undefined" && response.variants[id] !== null) {
                   return response.variants [id];
                }
            }
        }

        //autocompletion case (no variants)

            if(response instanceof thrift_types.SearchResult)
            {
                let variant: any = new thrift_types.Variant();
                variant.searchResult = response;
                return variant;
            }
            throw new Error("no variant provided in choice response for variant id id, bxRequest: " + String(this.bxRequests));


    }

    getFirstPositiveSuggestionSearchResult(variant: any, maxDistance: number = 10) {
        let obj=this;
        let suggestionSearchResult:any;
        if (variant.searchRelaxation == null || variant.searchRelaxation == undefined || variant.searchRelaxation.suggestionsResults == null) {
            return null;
        }

        variant.searchRelaxation.suggestionsResults.forEach(function (searchResult: any) {
            if (searchResult.totalHitCount > 0) {
                if (searchResult.queryText == "" || variant.searchResult.queryText == "") {
                    return;
                }
                let distance: any = obj.levenshtein_distance(searchResult.queryText, variant.searchResult.queryText);
                if (distance <= maxDistance && distance != -1) {
                    suggestionSearchResult= searchResult;
                }
            }
        });
        return suggestionSearchResult;
    }

    levenshtein_distance(s: string, t: string) {
        let m:number = s.length;
        let n:number = t.length;
        let d:number[][] = new Array(new Array());

        if (n == 0) {
            return m;
        }

        if (m == 0) {
            return n;
        }


        for (let i = 0; i <= n; i++) {
            d[i]=[];
            d[i][0]=i;
        }

        for (let j = 0; j <= m;j++) {
            d[0][j] = j;
        }


        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++)
            {
                let cost = (t[j - 1] == s[i - 1]) ? 0 : 1;

                d[i][j] = Math.min(
                    Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1),
                    d[i - 1][j - 1] + cost);
            }
        }

        return d[n][m];
    }

    getVariantSearchResult(variant: any, considerRelaxation: boolean = true, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        let correctedResult: any;
        if (variant == null) {
            return null;
        }
        let searchResult: any = variant.searchResult;
        if (considerRelaxation && variant.searchResult.totalHitCount == 0 && !(discardIfSubPhrases && this.areThereSubPhrases())) {
            correctedResult = this.getFirstPositiveSuggestionSearchResult(variant, maxDistance);
        }
        return (typeof (correctedResult) != "undefined" && correctedResult !== null) ? correctedResult : searchResult;
    }

    getSearchResultHitVariable(searchResult: any, hitId: any, field: string) {
        if (searchResult) {
            if (searchResult.hits) {
                searchResult.hits.forEach(function (item: any) {
                    if (item.values['id'][0] == hitId) {
                        return item.values[field][0];
                    }
                });
            } else if (typeof (searchResult.hitsGroups) != "undefined" && searchResult.hitsGroups !== null) {
                searchResult.hitsGroups.forEach(function (hitGroup: any) {
                    if (hitGroup.groupValue == hitId && (typeof (hitGroup.hits[0].values[field]) != "undefined" && hitGroup.hits[0].values[field] !== null)) {
                        return hitGroup.hits[0].values[field];
                    }
                });
            }
        }
        return null;
    }

    getSearchResultHitFieldValue(searchResult: any, hitId: any, fieldName: string = '') {
        if (searchResult && fieldName != '') {
            if (searchResult.hits) {
                searchResult.hits.forEach(function (item: any) {
                    if (item.values['id'] == hitId) {
                        return (typeof (item.values[fieldName]) != "undefined" && item.values[fieldName] !== null) ? item.values[fieldName][0] : null;
                    }
                });
            } else if (typeof (searchResult.hitsGroups) != "undefined" && searchResult.hitsGroups !== null) {
                searchResult.hitsGroups.forEach(function (hitGroup: any) {
                    if (hitGroup.groupValue == hitId) {
                        return (typeof (hitGroup.hits[0].values[fieldName]) != "undefined" && hitGroup.hits[0].values[fieldName] !== null) ? hitGroup.hits[0].values[fieldName][0] : null;
                    }
                });
            }
        }
        return null;
    }

    getSearchResultHitIds(searchResult: any, fieldId: string = 'id') {
        let ids: any = Array();
        if (searchResult) {
            if (searchResult.hits) {
                searchResult.hits.forEach(function (item: any) {
                    if (item.values[fieldId][0] !== null) {
                        fieldId = 'id';
                    }
                    ids.push(item.values[fieldId][0]);
                });
            } else if (typeof (searchResult.hitsGroups) != "undefined" && searchResult.hitsGroups !== null) {
                searchResult.hitsGroups.forEach(function (hitGroup: any) {
                    ids.push(hitGroup.groupValue);
                });
            }
        }
        return ids;
    }

    getHitExtraInfo(choice: any = null, hitId: number = 0, info_key: string = '', default_value: string = '', count: number = 0, considerRelaxation: boolean = true, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        let extraInfo: any = this.getSearchResultHitVariable(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), hitId, 'extraInfo');
        return ((typeof (extraInfo[info_key]) != "undefined" && extraInfo[info_key] !== null) ? extraInfo[info_key] : (default_value != '' ? default_value : null));
    }

    getHitVariable(choice: any = null, hitId: number = 0, field: string = '', count: number = 0, considerRelaxation: boolean = true, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        return this.getSearchResultHitVariable(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), hitId, field);
    }

    getHitFieldValue(choice: any = null, hitId: number = 0, fieldName: string = '', count: number = 0, considerRelaxation: boolean = true, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        return this.getSearchResultHitFieldValue(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), hitId, fieldName);
    }

    getHitIds(choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, fieldId: string = 'id', discardIfSubPhrases: boolean = true) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        return this.getSearchResultHitIds(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), fieldId);
    }

    retrieveHitFieldValues(item: any, field: string, fields: any, hits: string[]) {
        let fieldValues: any = Array();
        this.bxRequests.forEach(function (bxRequest: any) {
            fieldValues = fieldValues.concat(bxRequest.retrieveHitFieldValues(item, field, fields, hits));
        })
        return fieldValues;
    }

    Array_keys(input: any) {
        let output = new Array();
        let counter = 0;
        for (let i in input) {
            output[counter++] = i;
        }
        return output;
    }

    getSearchHitFieldValues(searchResult: any, fields: string[]) {
        let fieldValues: any = [];
        if (searchResult) {
            let hits = searchResult.hits;
            if (searchResult.hits == null) {
                hits = Array();
                if (searchResult.hitsGroups !== null) {
                    searchResult.hitsGroups.forEach(function (hitGroup: any) {
                        hits.push(hitGroup.hits[0]);
                    });
                }
            }
            hits.forEach(function (item: any) {
                let finalFields = fields;
                if (finalFields == null) {
                    finalFields = this.Array_keys(item.values);
                }
                finalFields.forEach(function (field: any) {
                    if (typeof (item.values[field]) != "undefined" && item.values[field] !== null) {
                        if (item.values[field] !== null && item.values[field] !== "") {
                            if (!fieldValues.hasOwnProperty(item.values['id'][0])) {
                                let key: string = item.values['id'][0];
                                fieldValues[key.toString()] = Array();
                              // fieldValues.push(item.values['id'][0],Array());
                            }
                            fieldValues[(item.values['id'][0]).toString()][field] = item.values[field];
                        }
                    }
                    if (item.values['id'] !== null && item.values['id'] !== undefined) {
                        if (item.values['id'][0] !== null && item.values['id'][0] !== undefined) {
                            if (fieldValues[item.values['id'][0]] !== null && fieldValues[item.values['id'][0]] !== undefined) {
                                if (fieldValues[item.values['id'][0]][field] === null)
                                    fieldValues[item.values['id'][0]][field] = this.retrieveHitFieldValues(item, field, searchResult.hits, finalFields);
                                }{
                            }
                        }
                    }

                });
            });
        }
        return fieldValues;
    }

    getRequestFacets(choice: any = null) {
        if (choice == null) {
            if (typeof (this.bxRequests[0]) != "undefined" && this.bxRequests[0] !== null) {
                return this.bxRequests[0].getFacets();
            }
            return null;
        }
        this.bxRequests.forEach(function (bxRequest: any) {
            if (bxRequest.getChoiceId() == choice) {
                return bxRequest.getFacets();
            }
        });
        return null;
    }

    getFacets(choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        let searchResult: any = this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases);
        let facets: any = this.getRequestFacets(choice);
        if (facets === "" || searchResult === null) {
            return new BxFacets();
        }
        facets.setSearchResults(searchResult);
        return facets;
    }

    getHitFieldValues(fields: any, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        return this.getSearchHitFieldValues(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), fields);
    }

    getFirstHitFieldValue(field: any = null, returnOneValue: boolean = true, hitIndex: number = 0, choice: any = null, count: number = 0, maxDistance: number = 10) {
        let fieldNames: any = null;
        if (field != null) {
            fieldNames = Array(field);
        }
        count = 0;
        let tempfieldValue = this.getHitFieldValues(fieldNames, choice, true, count, maxDistance);
        for (let id in tempfieldValue) {
            let fieldValueMap: any = tempfieldValue[id];
            if (count++ < hitIndex) {
                continue;
            }
            for (let fieldName in fieldValueMap) {
                let fieldValues = fieldValueMap[fieldName];
                if (fieldValues.length > 0) {
                    if (returnOneValue) {
                        return fieldValues[0];
                    } else {
                        return fieldValues;
                    }
                }
            }
        }
        return null;
    }

    getTotalHitCount(choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        let variant = this.getChoiceResponseVariant(choice, count);
        let searchResult = this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases);
        if (searchResult == null) {
            return 0;
        }
        return searchResult.totalHitCount;
    }

    areResultsCorrected(choice: any = null, count: number = 0, maxDistance: number = 10) {
        return this.getTotalHitCount(choice, false, count) == 0 && this.getTotalHitCount(choice, true, count, maxDistance) > 0 && this.areThereSubPhrases() == false;
    }

    areResultsCorrectedAndAlsoProvideSubPhrases(choice: any = null, count: number = 0, maxDistance: number = 10) {
        return this.getTotalHitCount(choice, false, count) == 0 && this.getTotalHitCount(choice, true, count, maxDistance, false) > 0 && this.areThereSubPhrases() == true;
    }

    getCorrectedQuery(choice: any = null, count: number = 0, maxDistance: number = 10) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        let searchResult: any = this.getVariantSearchResult(variant, true, maxDistance, false);
        if (searchResult) {
            return searchResult.queryText;
        }
        return null;
    }

    getResultTitle(choice: any = null, count: number = 0, ddefault: string = '- no title -') {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        if (typeof (variant.searchResultTitle) != "undefined" && variant.searchResultTitle !== null) {
            return variant.searchResultTitle;
        }
        return ddefault;
    }

    areThereSubPhrases(choice: any = null, count: number = 0, maxBaseResults: number = 0) {
        let variant: any = this.getChoiceResponseVariant(choice, count);
        return ((variant != null && variant.searchRelaxation != null && variant.searchRelaxation != undefined && (variant.searchRelaxation.subphrasesResults) != "undefined" && variant.searchRelaxation.subphrasesResults !== null) && variant.searchRelaxation.subphrasesResults.length > 0 && this.getTotalHitCount(choice, false, count) <= maxBaseResults);
    }

    getSubPhrasesQueries(choice: any = null, count: number = 0) {
        if (!this.areThereSubPhrases(choice, count)) {
            return Array();
        }
        let queries: any = Array();
        let variant: any = this.getChoiceResponseVariant(choice, count);
        variant.searchRelaxation.subphrasesResults.forEach(function (searchResult: any) {
            queries.push(searchResult.queryText);
        });
        return queries;
    }

    getSubPhraseSearchResult(queryText: string, choice: any = null, count: number = 0) {
        let tmpRet :any = null
        if (!this.areThereSubPhrases(choice, count)) {
            return tmpRet;
        }
        let variant: any = this.getChoiceResponseVariant(choice, count);
        variant.searchRelaxation.subphrasesResults.forEach(function (searchResult: any) {
            if (searchResult.queryText == queryText) {
                tmpRet = searchResult;
            }
        });
        return tmpRet;
    }

    getSubPhraseTotalHitCount(queryText: string, choice: any = null, count: number = 0) {
        let searchResult: any = this.getSubPhraseSearchResult(queryText, choice, count);
        if (searchResult) {
            return searchResult.totalHitCount;
        }
        return 0;
    }

    getSubPhraseHitIds(queryText: string, choice: any = null, count: number = 0, fieldId: string = 'id') {
        let searchResult = this.getSubPhraseSearchResult(queryText, choice, count);
        if (searchResult) {
            return this.getSearchResultHitIds(searchResult, fieldId);
        }
        return Array();
    }

    getSubPhraseHitFieldValues(queryText: string, fields: string[], choice: any = null, considerRelaxation: boolean = true, count: number = 0) {
        let searchResult: any = this.getSubPhraseSearchResult(queryText, choice, count);
        if (searchResult) {
            return this.getSearchHitFieldValues(searchResult, fields);
        }
        return Array();
    }

    toJson(fields: string[]) {
        let object: any = Array();
        object['hits'] = Array();
        let tempFieldValues = this.getHitFieldValues(fields);
        for (let id in tempFieldValues) {
            let fieldValueMap: any = tempFieldValues[id];
            let hitFieldValues: any = Array();
            for (let fieldName in fieldValueMap) {
                let fieldValues: any = fieldValueMap[fieldName];
                hitFieldValues[fieldName] = Array({'values': fieldValues});
            }
            object['hits'].push(Array({'id': id, 'fieldValues': hitFieldValues}));
        }
        return JSON.stringify(object);
    }

    getSearchResultExtraInfo(searchResult: any, extraInfoKey: any, defaultExtraInfoValue: any = null) {
        if (searchResult) {
            if (Array.isArray(searchResult.extraInfo) && searchResult.extraInfo.length > 0 && (typeof (searchResult.extraInfo[extraInfoKey]) != "undefined" && searchResult.extraInfo[extraInfoKey] !== null)) {
                return searchResult.extraInfo[extraInfoKey];
            }
            return defaultExtraInfoValue;
        }
        return defaultExtraInfoValue;
    }

    mergeJourneyParams(parentParams: any, childParams: any) {
        let mergedParams = (parentParams === null) ? Array() : parentParams;
        childParams = (childParams === null) ? Array() : childParams;
        childParams.forEach(function (childParam: any) {
            let add: any = true;
            let childParamName = childParam['name'];
            parentParams.forEach(function (parentParam: any) {
                let parentParamName: any = parentParam['name'];
                if (parentParamName == childParamName) {
                    add = false;
                    return false;
                }
            });
            if (add && childParam !== null) {
                mergedParams.push(childParam);
            }
        });
        return mergedParams;
    }

    getCPOJourney(choice_id: any = 'narrative') {
        let variant: any = this.getChoiceResponseVariant(choice_id);
        let journey: any = Array();
        if (variant) {
            variant.extraInfo.forEach(function (k: any) {
                let v: any = variant.extraInfo[k];
                if (k.indexOf("cpo_journey") === 0) {
                    journey = JSON.parse(v);
                    return false;
                }
            });
        }
        return journey;
    }

    getStoryLine(choice_id: any = 'narrative') {
        let journey = this.getCPOJourney(choice_id);
        if (typeof (journey['storyLines']) != "undefined" && journey['storyLines'] !== null) {
            let params = (typeof (journey['parameters']) != "undefined" && journey['parameters'] !== null) ? journey['parameters'] : Array();
            for (let gi in journey['storyLines']) {
                let groupedStoryLine = journey['storyLines'][gi];
                if (typeof (groupedStoryLine['storyLine']) != "undefined" && groupedStoryLine['storyLine'] !== null) {
                    let groupedStoryLineParameters = (typeof (groupedStoryLine['parameters']) != "undefined" && groupedStoryLine['parameters'] !== null) ? groupedStoryLine['parameters'] : Array();
                    params = this.mergeJourneyParams(params, groupedStoryLineParameters);
                    let storyLine: any = groupedStoryLine['storyLine'];
                    let storyLineParameters: any = (typeof (storyLine['parameters']) != "undefined" && storyLine['parameters'] !== null) ? storyLine['parameters'] : Array();
                    storyLine['parameters'] = this.mergeJourneyParams(params, storyLineParameters);
                    return storyLine;
                }
            }
        }
        return Array();
    }

    getParameterValuesForVisualElement(element: any, paramName: string) {
        if ((typeof (element['parameters']) != "undefined" && element['parameters'] !== null) && Array.isArray(element['parameters'])) {
            element['parameters'].forEach(function (parameter: any) {
                if (parameter['name'] == paramName) {
                    return parameter['values'];
                }
            });
        }
        return null;
    }

    getNarrativeDependencies(choice_id: any = 'narrative') {
        let dependencies: any = Array();
        let narratives: any = this.getNarratives(choice_id);
        narratives.forEach(function (visualElement: any) {
            let values: any = this.getParameterValuesForVisualElement(visualElement['visualElement'], 'dependencies');
            if (values) {
                let value = values;
                value = value.replace("\\", '');
                let dependency = JSON.parse(value);
                if (dependency) {
                    dependencies = dependencies.concat(dependency);
                }
            }
        });
        return dependencies;
    }

    getNarratives(choice_id: any = 'narrative') {
        let storyLine: any = this.getStoryLine(choice_id);
        let params = (typeof (storyLine['parameters']) != "undefined" && storyLine['parameters'] !== null) ? storyLine['parameters'] : Array();
        if (typeof (storyLine['groupedNarratives']) != "undefined" && storyLine['groupedNarratives'] !== null) {
            storyLine['groupedNarratives'].forEach(function (groupedNarrative: any) {
                if (typeof (groupedNarrative['narratives']) != "undefined" && groupedNarrative['narratives'] !== null) {
                    let narratives = groupedNarrative['narratives'];
                    if ((typeof (narratives['narrative']) != "undefined" && narratives['narrative'] !== null) && (typeof (narratives['narrative']['acts']) != "undefined" && narratives['narrative']['acts'] !== null)) {
                        let narrativesParameters: any = (typeof (narratives['parameters']) != "undefined" && narratives['parameters'] !== null) ? narratives['parameters'] : Array();
                        let narrativeParameters = (typeof (narratives['narrative']['parameters']) != "undefined" && narratives['narrative']['parameters'] !== null) ? narratives['narrative']['parameters'] : Array();
                        params = this.mergeJourneyParams(params, narrativesParameters);
                        params = this.mergeJourneyParams(params, narrativeParameters);
                        let acts = narratives['narrative']['acts'];
                        narratives['narrative']['acts'] = this.propagateParams(acts, params);
                        return narratives['narrative']['acts'][0]['chapter']['renderings'][0]['rendering']['visualElements'];
                    }
                }
            });
        }
        return Array();
    }

    getOverwriteParams(parameters: any) {
        let overwriteParameters: any = Array();
        parameters.forEach(function (parameter: any) {
            if (parameter['name'].indexOf('!') === 0) {
                let overwrite = parameter;
                if (overwrite['name'].charAt(0) === "!") {
                    overwrite['name'].substring(1, overwrite['name'].length);
                }
                overwriteParameters.push(overwrite);
            }
        });
        return overwriteParameters;
    }

    prepareVisualElement(render: any, overwriteParams: any) {
        let visualElement: any = render['visualElement'];
        let visualElementParams: any = this.mergeJourneyParams(render['parameters'], visualElement['parameters']);
        visualElement['parameters'] = this.mergeJourneyParams(overwriteParams, visualElementParams);
        overwriteParams = overwriteParams.concat(this.getOverwriteParams(visualElement['parameters']));
        if ((typeof (visualElement['subRenderings']) != "undefined" && visualElement['subRenderings'] !== null) && (visualElement['subRenderings'].length)) {
            visualElement['subRenderings'].forEach(function (index: any) {
                let subRendering: any = visualElement['subRenderings'][index];
                subRendering['rendering']['visualElements'].forEach(function (index2: any) {
                    let subElement: any = subRendering['rendering']['visualElements'][index2];
                    subRendering['rendering']['visualElements'][index2] = this.prepareVisualElement(subElement, overwriteParams);
                });
                visualElement['subRenderings'][index] = subRendering;
            });
        }
        render['visualElement'] = visualElement;
        return render;
    }

    propagateParams(acts: any, params: any) {
        for (let index in acts) {
            let act: any = acts[index];
            if (typeof (act['chapter']) != "undefined" && act['chapter'] !== null) {
                let actParameters: any = (typeof (act['parameters']) != "undefined" && act['parameters'] !== null) ? act['parameters'] : Array();
                params = this.mergeJourneyParams(params, actParameters);
                act['parameters'] = params;
                let chapter: any = act['chapter'];
                if (typeof (chapter['renderings']) != "undefined" && chapter['renderings'] !== null) {
                    let chapterParameters = (typeof (chapter['parameters']) != "undefined" && chapter['parameters'] !== null) ? chapter['parameters'] : Array();
                    params = this.mergeJourneyParams(params, chapterParameters);
                    chapter['parameters'] = params;
                    for (let index1 in chapter['renderings']) {
                        let rendering: any = chapter['renderings'][index1];
                        if ((typeof (rendering['rendering']['visualElements']) != "undefined" && rendering['rendering']['visualElements'] !== null) && (Array.isArray(rendering['rendering']['visualElements']))) {
                            let renderingParameters: any = (typeof (rendering['parameters']) != "undefined" && rendering['parameters'] !== null) ? rendering['parameters'] : Array();
                            params = this.mergeJourneyParams(params, renderingParameters);
                            rendering['parameters'] = params;
                            let renderParameters = (typeof (rendering['rendering']['parameters']) != "undefined" && rendering['rendering']['parameters'] !== null) ? rendering['rendering']['parameters'] : Array();
                            params = this.mergeJourneyParams(params, renderParameters);
                            rendering['rendering']['parameters'] = params;
                            for (let index2 in rendering['rendering']['visualElements']) {
                                let render: any = rendering['rendering']['visualElements'][index2];
                                render = this.prepareVisualElement(render, params);
                                rendering['rendering']['visualElements'][index2] = render;
                            }
                            chapter['renderings'][index1] = rendering;
                        }
                    }
                    act['chapter'] = chapter;
                    acts[index] = act;
                }
            }
        }
        return acts;
    }

    getVariantExtraInfo(variant: any, extraInfoKey: any, defaultExtraInfoValue: any = null) {
        if (variant) {
            if (Array.isArray(variant.extraInfo) && variant.extraInfo.length > 0 && (typeof (variant.extraInfo[extraInfoKey]) != "undefined" && variant.extraInfo[extraInfoKey] !== null)) {
                return variant.extraInfo[extraInfoKey];
            }
            return defaultExtraInfoValue;
        }
        return defaultExtraInfoValue;
    }

    getExtraInfo(extraInfoKey: any, defaultExtraInfoValue: any = null, choice: any = null, considerRelaxation: any = true, count: any = 0, maxDistance: any = 10, discardIfSubPhrases: any = true) {
        let variant = this.getChoiceResponseVariant(choice, count);
        return this.getVariantExtraInfo(variant, extraInfoKey);
    }

    ucfirst(str: any) {
        if (typeof (str) !== 'string') return ''
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    prettyPrintLabel(label: any, prettyPrint: any = false) {
        if (prettyPrint) {
            label = label.replace('_', ' ');
            label = label.replace('products', '');
            label = this.ucfirst(label.trim());
        }
        return label;
    }

    getLanguage(defaultLanguage: string = 'en') {
        if (typeof (this.bxRequests[0]) != "undefined" && this.bxRequests[0] !== null) {
            return this.bxRequests[0].getLanguage();
        }
        return defaultLanguage;
    }

    getExtraInfoLocalizedValue(extraInfoKey: any, language: any = null, defaultExtraInfoValue: any = null, prettyPrint: any = false,
                               choice: any = null, considerRelaxation: any = true, count: any = 0, maxDistance: any = 10, discardIfSubPhrases: any = true) {
        let defaultValue: string = "";
        let jsonLabel: any = this.getExtraInfo(extraInfoKey, defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        if (jsonLabel == null) {
            return this.prettyPrintLabel(defaultValue, prettyPrint);
        }
        let labels: any = JSON.parse(jsonLabel);
        if (language == null) {
            language = this.getLanguage();
        }
        if (Array.isArray(labels) == false) {
            return jsonLabel;
        }
        labels.forEach(function (label: any) {
            if (language && label.language != language) {
                return;
            }
            if (label.value != null) {
                return this.prettyPrintLabel(label.value, prettyPrint);
            }
        });
        return this.prettyPrintLabel(defaultValue, prettyPrint);
    }

    getSearchMessageTitle(language: any = null, defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count = 0, maxDistance = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfoLocalizedValue('search_message_title', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageDescription(language: any = null, defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfoLocalizedValue('search_message_description', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageTitleStyle(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_title_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageDescriptionStyle(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_description_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageContainerStyle(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_container_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageLinkStyle(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_link_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageSideImageStyle(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_side_image_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageMainImageStyle(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_main_image_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageMainImage(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_main_image', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageSideImage(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_side_image', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageLink(language: any = null, defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfoLocalizedValue('search_message_link', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getRedirectLink(language: any = null, defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfoLocalizedValue('redirect_url', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageGeneralCss(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_general_css', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getSearchMessageDisplayType(defaultExtraInfoValue: any = null, prettyPrint: boolean = false, choice: any = null, considerRelaxation: boolean = true, count: number = 0, maxDistance: number = 10, discardIfSubPhrases: boolean = true) {
        return this.getExtraInfo('search_message_display_type', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
    }

    getLocalizedValue(values: any, key: any = null) {
        if (Array.isArray(values)) {
            let language: any = this.getLanguage();
            if (key === null && (typeof (values[language]) != "undefined" && values[language] !== null)) {
                return values[language];
            }
            if (typeof (values[key]) != "undefined" && values[key] !== null) {
                for (let lang in values[key]) {
                    let val = values[key][lang];
                    if (lang == language) {
                        return val;
                    }
                }
            }
        }
        return values;
    }

}