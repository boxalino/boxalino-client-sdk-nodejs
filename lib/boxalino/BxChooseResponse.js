(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BxFacets"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var thrift = require('thrift');
    var BxFacets_1 = require("./BxFacets");
    var BxChooseResponse = /** @class */ (function () {
        function BxChooseResponse(response, _bxRequests) {
            if (_bxRequests === void 0) { _bxRequests = Array(); }
            this.notifications = Array();
            this.notificationLog = Array();
            this.notificationMode = false;
            this.response = response;
            this.bxRequests = Array.isArray(_bxRequests) ? _bxRequests : Array(_bxRequests);
        }
        BxChooseResponse.prototype.setNotificationMode = function (mode) {
            this.notificationMode = mode;
            this.bxRequests.forEach(function (bxRequest) {
                var facet = bxRequest.getFacets();
                if (facet !== null) {
                    facet.setNotificationMode(mode);
                }
            });
        };
        BxChooseResponse.prototype.getNotificationMode = function () {
            return this.notificationMode;
        };
        BxChooseResponse.prototype.addNotification = function (name, parameters) {
            if (this.notificationMode) {
                this.notifications.push(Array({ 'name': name, 'parameters': parameters }));
            }
        };
        BxChooseResponse.prototype.getNotifications = function () {
            var finalNotifications = this.notifications;
            this.bxRequests.forEach(function (bxRequest) {
                finalNotifications.push(Array({ 'name': 'bxFacet', 'parameters': this.bxRequest.getChoiceId() }));
                var facets = bxRequest.getFacets();
                if (facets != null) {
                    var notify = facets.getNotifications();
                    notify.forEach(function (notification) {
                        finalNotifications.push(notification);
                    });
                }
            });
            return finalNotifications;
        };
        BxChooseResponse.prototype.getResponse = function () {
            return this.response;
        };
        BxChooseResponse.prototype.getChoiceResponseVariant = function (choice, count) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            for (var k in this.bxRequests) {
                var bxRequest = this.bxRequests[k];
                if (choice == null || choice == bxRequest.getChoiceId()) {
                    if (count > 0) {
                        count--;
                        continue;
                    }
                    return this.getChoiceIdResponseVariant(k);
                }
            }
        };
        BxChooseResponse.prototype.getChoiceIdFromVariantIndex = function (variant_index) {
            return (typeof (this.bxRequests[variant_index]) != "undefined" && this.bxRequests[variant_index] !== null) ? this.bxRequests[variant_index].getChoiceId() : null;
        };
        BxChooseResponse.prototype.getChoiceIdResponseVariant = function (id) {
            if (id === void 0) { id = 0; }
            var response = this.getResponse();
            if (response != null && response != '') {
                if (response.variants != null && response.variants != '') {
                    if (typeof (response.variants[id]) != "undefined" && response.variants[id] !== null) {
                        return response.variants[id];
                    }
                }
            }
            //autocompletion case (no variants)
            if (response.class != null) {
                if (response.class.name == 'SearchResult') {
                    var variant = new thrift.Variant();
                    variant.searchResult = response;
                    return variant;
                }
                throw new Error("no variant provided in choice response for variant id id, bxRequest: " + String(this.bxRequests));
            }
        };
        BxChooseResponse.prototype.getFirstPositiveSuggestionSearchResult = function (variant, maxDistance) {
            if (maxDistance === void 0) { maxDistance = 10; }
            var obj = this;
            var suggestionSearchResult;
            if (variant.searchRelaxation == null || variant.searchRelaxation == undefined || variant.searchRelaxation.suggestionsResults == null) {
                return null;
            }
            variant.searchRelaxation.suggestionsResults.forEach(function (searchResult) {
                if (searchResult.totalHitCount > 0) {
                    if (searchResult.queryText == "" || variant.searchResult.queryText == "") {
                        return;
                    }
                    var distance = obj.levenshtein_distance(searchResult.queryText, variant.searchResult.queryText);
                    if (distance <= maxDistance && distance != -1) {
                        suggestionSearchResult = searchResult;
                    }
                }
            });
            return suggestionSearchResult;
        };
        BxChooseResponse.prototype.levenshtein_distance = function (s, t) {
            var m = s.length;
            var n = t.length;
            var d = new Array(new Array());
            if (n == 0) {
                return m;
            }
            if (m == 0) {
                return n;
            }
            for (var i = 0; i <= n; i++) {
                d[i] = [];
                d[i][0] = i;
            }
            for (var j = 0; j <= m; j++) {
                d[0][j] = j;
            }
            for (var i = 1; i <= m; i++) {
                for (var j = 1; j <= n; j++) {
                    var cost = (t[j - 1] == s[i - 1]) ? 0 : 1;
                    d[i][j] = Math.min(Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1), d[i - 1][j - 1] + cost);
                }
            }
            return d[n][m];
        };
        BxChooseResponse.prototype.getVariantSearchResult = function (variant, considerRelaxation, maxDistance, discardIfSubPhrases) {
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var correctedResult;
            if (variant == null) {
                return null;
            }
            var searchResult = variant.searchResult;
            if (considerRelaxation && variant.searchResult.totalHitCount == 0 && !(discardIfSubPhrases && this.areThereSubPhrases())) {
                correctedResult = this.getFirstPositiveSuggestionSearchResult(variant, maxDistance);
            }
            return (typeof (correctedResult) != "undefined" && correctedResult !== null) ? correctedResult : searchResult;
        };
        BxChooseResponse.prototype.getSearchResultHitVariable = function (searchResult, hitId, field) {
            if (searchResult) {
                if (searchResult.hits) {
                    searchResult.hits.forEach(function (item) {
                        if (item.values['id'][0] == hitId) {
                            return item.values[field][0];
                        }
                    });
                }
                else if (typeof (searchResult.hitsGroups) != "undefined" && searchResult.hitsGroups !== null) {
                    searchResult.hitsGroups.forEach(function (hitGroup) {
                        if (hitGroup.groupValue == hitId && (typeof (hitGroup.hits[0].values[field]) != "undefined" && hitGroup.hits[0].values[field] !== null)) {
                            return hitGroup.hits[0].values[field];
                        }
                    });
                }
            }
            return null;
        };
        BxChooseResponse.prototype.getSearchResultHitFieldValue = function (searchResult, hitId, fieldName) {
            if (fieldName === void 0) { fieldName = ''; }
            if (searchResult && fieldName != '') {
                if (searchResult.hits) {
                    searchResult.hits.forEach(function (item) {
                        if (item.values['id'] == hitId) {
                            return (typeof (item.values[fieldName]) != "undefined" && item.values[fieldName] !== null) ? item.values[fieldName][0] : null;
                        }
                    });
                }
                else if (typeof (searchResult.hitsGroups) != "undefined" && searchResult.hitsGroups !== null) {
                    searchResult.hitsGroups.forEach(function (hitGroup) {
                        if (hitGroup.groupValue == hitId) {
                            return (typeof (hitGroup.hits[0].values[fieldName]) != "undefined" && hitGroup.hits[0].values[fieldName] !== null) ? hitGroup.hits[0].values[fieldName][0] : null;
                        }
                    });
                }
            }
            return null;
        };
        BxChooseResponse.prototype.getSearchResultHitIds = function (searchResult, fieldId) {
            if (fieldId === void 0) { fieldId = 'id'; }
            var ids = Array();
            if (searchResult) {
                if (searchResult.hits) {
                    searchResult.hits.forEach(function (item) {
                        if (item.values[fieldId][0] !== null) {
                            fieldId = 'id';
                        }
                        ids.push(item.values[fieldId][0]);
                    });
                }
                else if (typeof (searchResult.hitsGroups) != "undefined" && searchResult.hitsGroups !== null) {
                    searchResult.hitsGroups.forEach(function (hitGroup) {
                        ids.push(hitGroup.groupValue);
                    });
                }
            }
            return ids;
        };
        BxChooseResponse.prototype.getHitExtraInfo = function (choice, hitId, info_key, default_value, count, considerRelaxation, maxDistance, discardIfSubPhrases) {
            if (choice === void 0) { choice = null; }
            if (hitId === void 0) { hitId = 0; }
            if (info_key === void 0) { info_key = ''; }
            if (default_value === void 0) { default_value = ''; }
            if (count === void 0) { count = 0; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            var extraInfo = this.getSearchResultHitVariable(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), hitId, 'extraInfo');
            return ((typeof (extraInfo[info_key]) != "undefined" && extraInfo[info_key] !== null) ? extraInfo[info_key] : (default_value != '' ? default_value : null));
        };
        BxChooseResponse.prototype.getHitVariable = function (choice, hitId, field, count, considerRelaxation, maxDistance, discardIfSubPhrases) {
            if (choice === void 0) { choice = null; }
            if (hitId === void 0) { hitId = 0; }
            if (field === void 0) { field = ''; }
            if (count === void 0) { count = 0; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            return this.getSearchResultHitVariable(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), hitId, field);
        };
        BxChooseResponse.prototype.getHitFieldValue = function (choice, hitId, fieldName, count, considerRelaxation, maxDistance, discardIfSubPhrases) {
            if (choice === void 0) { choice = null; }
            if (hitId === void 0) { hitId = 0; }
            if (fieldName === void 0) { fieldName = ''; }
            if (count === void 0) { count = 0; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            return this.getSearchResultHitFieldValue(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), hitId, fieldName);
        };
        BxChooseResponse.prototype.getHitIds = function (choice, considerRelaxation, count, maxDistance, fieldId, discardIfSubPhrases) {
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (fieldId === void 0) { fieldId = 'id'; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            return this.getSearchResultHitIds(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), fieldId);
        };
        BxChooseResponse.prototype.retrieveHitFieldValues = function (item, field, fields, hits) {
            var fieldValues = Array();
            this.bxRequests.forEach(function (bxRequest) {
                fieldValues = fieldValues.concat(bxRequest.retrieveHitFieldValues(item, field, fields, hits));
            });
            return fieldValues;
        };
        BxChooseResponse.prototype.Array_keys = function (input) {
            var output = new Array();
            var counter = 0;
            for (var i in input) {
                output[counter++] = i;
            }
            return output;
        };
        BxChooseResponse.prototype.getSearchHitFieldValues = function (searchResult, fields) {
            var fieldValues = [];
            if (searchResult) {
                var hits_1 = searchResult.hits;
                if (searchResult.hits == null) {
                    hits_1 = Array();
                    if (searchResult.hitsGroups !== null) {
                        searchResult.hitsGroups.forEach(function (hitGroup) {
                            hits_1.push(hitGroup.hits[0]);
                        });
                    }
                }
                hits_1.forEach(function (item) {
                    var finalFields = fields;
                    if (finalFields == null) {
                        finalFields = this.Array_keys(item.values);
                    }
                    finalFields.forEach(function (field) {
                        if (typeof (item.values[field]) != "undefined" && item.values[field] !== null) {
                            if (item.values[field] !== null && item.values[field] !== "") {
                                if (!fieldValues.hasOwnProperty(item.values['id'][0])) {
                                    var key = item.values['id'][0];
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
                                }
                                {
                                }
                            }
                        }
                    });
                });
            }
            return fieldValues;
        };
        BxChooseResponse.prototype.getRequestFacets = function (choice) {
            if (choice === void 0) { choice = null; }
            if (choice == null) {
                if (typeof (this.bxRequests[0]) != "undefined" && this.bxRequests[0] !== null) {
                    return this.bxRequests[0].getFacets();
                }
                return null;
            }
            this.bxRequests.forEach(function (bxRequest) {
                if (bxRequest.getChoiceId() == choice) {
                    return bxRequest.getFacets();
                }
            });
            return null;
        };
        BxChooseResponse.prototype.getFacets = function (choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            var searchResult = this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases);
            var facets = this.getRequestFacets(choice);
            if (facets === "" || searchResult === null) {
                return new BxFacets_1.BxFacets();
            }
            facets.setSearchResults(searchResult);
            return facets;
        };
        BxChooseResponse.prototype.getHitFieldValues = function (fields, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            return this.getSearchHitFieldValues(this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases), fields);
        };
        BxChooseResponse.prototype.getFirstHitFieldValue = function (field, returnOneValue, hitIndex, choice, count, maxDistance) {
            if (field === void 0) { field = null; }
            if (returnOneValue === void 0) { returnOneValue = true; }
            if (hitIndex === void 0) { hitIndex = 0; }
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            var fieldNames = null;
            if (field != null) {
                fieldNames = Array(field);
            }
            count = 0;
            var tempfieldValue = this.getHitFieldValues(fieldNames, choice, true, count, maxDistance);
            for (var id in tempfieldValue) {
                var fieldValueMap = tempfieldValue[id];
                if (count++ < hitIndex) {
                    continue;
                }
                for (var fieldName in fieldValueMap) {
                    var fieldValues = fieldValueMap[fieldName];
                    if (fieldValues.length > 0) {
                        if (returnOneValue) {
                            return fieldValues[0];
                        }
                        else {
                            return fieldValues;
                        }
                    }
                }
            }
            return null;
        };
        BxChooseResponse.prototype.getTotalHitCount = function (choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            var searchResult = this.getVariantSearchResult(variant, considerRelaxation, maxDistance, discardIfSubPhrases);
            if (searchResult == null) {
                return 0;
            }
            return searchResult.totalHitCount;
        };
        BxChooseResponse.prototype.areResultsCorrected = function (choice, count, maxDistance) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            return this.getTotalHitCount(choice, false, count) == 0 && this.getTotalHitCount(choice, true, count, maxDistance) > 0 && this.areThereSubPhrases() == false;
        };
        BxChooseResponse.prototype.areResultsCorrectedAndAlsoProvideSubPhrases = function (choice, count, maxDistance) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            return this.getTotalHitCount(choice, false, count) == 0 && this.getTotalHitCount(choice, true, count, maxDistance, false) > 0 && this.areThereSubPhrases() == true;
        };
        BxChooseResponse.prototype.getCorrectedQuery = function (choice, count, maxDistance) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            var variant = this.getChoiceResponseVariant(choice, count);
            var searchResult = this.getVariantSearchResult(variant, true, maxDistance, false);
            if (searchResult) {
                return searchResult.queryText;
            }
            return null;
        };
        BxChooseResponse.prototype.getResultTitle = function (choice, count, ddefault) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (ddefault === void 0) { ddefault = '- no title -'; }
            var variant = this.getChoiceResponseVariant(choice, count);
            if (typeof (variant.searchResultTitle) != "undefined" && variant.searchResultTitle !== null) {
                return variant.searchResultTitle;
            }
            return ddefault;
        };
        BxChooseResponse.prototype.areThereSubPhrases = function (choice, count, maxBaseResults) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (maxBaseResults === void 0) { maxBaseResults = 0; }
            var variant = this.getChoiceResponseVariant(choice, count);
            return ((variant != null && variant.searchRelaxation != null && variant.searchRelaxation != undefined && (variant.searchRelaxation.subphrasesResults) != "undefined" && variant.searchRelaxation.subphrasesResults !== null) && variant.searchRelaxation.subphrasesResults.length > 0 && this.getTotalHitCount(choice, false, count) <= maxBaseResults);
        };
        BxChooseResponse.prototype.getSubPhrasesQueries = function (choice, count) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (!this.areThereSubPhrases(choice, count)) {
                return Array();
            }
            var queries = Array();
            var variant = this.getChoiceResponseVariant(choice, count);
            variant.searchRelaxation.subphrasesResults.forEach(function (searchResult) {
                queries.push(searchResult.queryText);
            });
            return queries;
        };
        BxChooseResponse.prototype.getSubPhraseSearchResult = function (queryText, choice, count) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (!this.areThereSubPhrases(choice, count)) {
                return null;
            }
            var variant = this.getChoiceResponseVariant(choice, count);
            variant.searchRelaxation.subphrasesResults.forEach(function (searchResult) {
                if (searchResult.queryText == queryText) {
                    return searchResult;
                }
            });
            return null;
        };
        BxChooseResponse.prototype.getSubPhraseTotalHitCount = function (queryText, choice, count) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            var searchResult = this.getSubPhraseSearchResult(queryText, choice, count);
            if (searchResult) {
                return searchResult.totalHitCount;
            }
            return 0;
        };
        BxChooseResponse.prototype.getSubPhraseHitIds = function (queryText, choice, count, fieldId) {
            if (choice === void 0) { choice = null; }
            if (count === void 0) { count = 0; }
            if (fieldId === void 0) { fieldId = 'id'; }
            var searchResult = this.getSubPhraseSearchResult(queryText, choice, count);
            if (searchResult) {
                return this.getSearchResultHitIds(searchResult, fieldId);
            }
            return Array();
        };
        BxChooseResponse.prototype.getSubPhraseHitFieldValues = function (queryText, fields, choice, considerRelaxation, count) {
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            var searchResult = this.getSubPhraseSearchResult(queryText, choice, count);
            if (searchResult) {
                return this.getSearchHitFieldValues(searchResult, fields);
            }
            return Array();
        };
        BxChooseResponse.prototype.toJson = function (fields) {
            var object = Array();
            object['hits'] = Array();
            var tempFieldValues = this.getHitFieldValues(fields);
            for (var id in tempFieldValues) {
                var fieldValueMap = tempFieldValues[id];
                var hitFieldValues = Array();
                for (var fieldName in fieldValueMap) {
                    var fieldValues = fieldValueMap[fieldName];
                    hitFieldValues[fieldName] = Array({ 'values': fieldValues });
                }
                object['hits'].push(Array({ 'id': id, 'fieldValues': hitFieldValues }));
            }
            return JSON.stringify(object);
        };
        BxChooseResponse.prototype.getSearchResultExtraInfo = function (searchResult, extraInfoKey, defaultExtraInfoValue) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (searchResult) {
                if (Array.isArray(searchResult.extraInfo) && searchResult.extraInfo.length > 0 && (typeof (searchResult.extraInfo[extraInfoKey]) != "undefined" && searchResult.extraInfo[extraInfoKey] !== null)) {
                    return searchResult.extraInfo[extraInfoKey];
                }
                return defaultExtraInfoValue;
            }
            return defaultExtraInfoValue;
        };
        BxChooseResponse.prototype.mergeJourneyParams = function (parentParams, childParams) {
            var mergedParams = (parentParams === null) ? Array() : parentParams;
            childParams = (childParams === null) ? Array() : childParams;
            childParams.forEach(function (childParam) {
                var add = true;
                var childParamName = childParam['name'];
                parentParams.forEach(function (parentParam) {
                    var parentParamName = parentParam['name'];
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
        };
        BxChooseResponse.prototype.getCPOJourney = function (choice_id) {
            if (choice_id === void 0) { choice_id = 'narrative'; }
            var variant = this.getChoiceResponseVariant(choice_id);
            var journey = Array();
            if (variant) {
                variant.extraInfo.forEach(function (k) {
                    var v = variant.extraInfo[k];
                    if (k.indexOf("cpo_journey") === 0) {
                        journey = JSON.parse(v);
                        return false;
                    }
                });
            }
            return journey;
        };
        BxChooseResponse.prototype.getStoryLine = function (choice_id) {
            if (choice_id === void 0) { choice_id = 'narrative'; }
            var journey = this.getCPOJourney(choice_id);
            if (typeof (journey['storyLines']) != "undefined" && journey['storyLines'] !== null) {
                var params = (typeof (journey['parameters']) != "undefined" && journey['parameters'] !== null) ? journey['parameters'] : Array();
                for (var gi in journey['storyLines']) {
                    var groupedStoryLine = journey['storyLines'][gi];
                    if (typeof (groupedStoryLine['storyLine']) != "undefined" && groupedStoryLine['storyLine'] !== null) {
                        var groupedStoryLineParameters = (typeof (groupedStoryLine['parameters']) != "undefined" && groupedStoryLine['parameters'] !== null) ? groupedStoryLine['parameters'] : Array();
                        params = this.mergeJourneyParams(params, groupedStoryLineParameters);
                        var storyLine = groupedStoryLine['storyLine'];
                        var storyLineParameters = (typeof (storyLine['parameters']) != "undefined" && storyLine['parameters'] !== null) ? storyLine['parameters'] : Array();
                        storyLine['parameters'] = this.mergeJourneyParams(params, storyLineParameters);
                        return storyLine;
                    }
                }
            }
            return Array();
        };
        BxChooseResponse.prototype.getParameterValuesForVisualElement = function (element, paramName) {
            if ((typeof (element['parameters']) != "undefined" && element['parameters'] !== null) && Array.isArray(element['parameters'])) {
                element['parameters'].forEach(function (parameter) {
                    if (parameter['name'] == paramName) {
                        return parameter['values'];
                    }
                });
            }
            return null;
        };
        BxChooseResponse.prototype.getNarrativeDependencies = function (choice_id) {
            if (choice_id === void 0) { choice_id = 'narrative'; }
            var dependencies = Array();
            var narratives = this.getNarratives(choice_id);
            narratives.forEach(function (visualElement) {
                var values = this.getParameterValuesForVisualElement(visualElement['visualElement'], 'dependencies');
                if (values) {
                    var value = values;
                    value = value.replace("\\", '');
                    var dependency = JSON.parse(value);
                    if (dependency) {
                        dependencies = dependencies.concat(dependency);
                    }
                }
            });
            return dependencies;
        };
        BxChooseResponse.prototype.getNarratives = function (choice_id) {
            if (choice_id === void 0) { choice_id = 'narrative'; }
            var storyLine = this.getStoryLine(choice_id);
            var params = (typeof (storyLine['parameters']) != "undefined" && storyLine['parameters'] !== null) ? storyLine['parameters'] : Array();
            if (typeof (storyLine['groupedNarratives']) != "undefined" && storyLine['groupedNarratives'] !== null) {
                storyLine['groupedNarratives'].forEach(function (groupedNarrative) {
                    if (typeof (groupedNarrative['narratives']) != "undefined" && groupedNarrative['narratives'] !== null) {
                        var narratives = groupedNarrative['narratives'];
                        if ((typeof (narratives['narrative']) != "undefined" && narratives['narrative'] !== null) && (typeof (narratives['narrative']['acts']) != "undefined" && narratives['narrative']['acts'] !== null)) {
                            var narrativesParameters = (typeof (narratives['parameters']) != "undefined" && narratives['parameters'] !== null) ? narratives['parameters'] : Array();
                            var narrativeParameters = (typeof (narratives['narrative']['parameters']) != "undefined" && narratives['narrative']['parameters'] !== null) ? narratives['narrative']['parameters'] : Array();
                            params = this.mergeJourneyParams(params, narrativesParameters);
                            params = this.mergeJourneyParams(params, narrativeParameters);
                            var acts = narratives['narrative']['acts'];
                            narratives['narrative']['acts'] = this.propagateParams(acts, params);
                            return narratives['narrative']['acts'][0]['chapter']['renderings'][0]['rendering']['visualElements'];
                        }
                    }
                });
            }
            return Array();
        };
        BxChooseResponse.prototype.getOverwriteParams = function (parameters) {
            var overwriteParameters = Array();
            parameters.forEach(function (parameter) {
                if (parameter['name'].indexOf('!') === 0) {
                    var overwrite = parameter;
                    if (overwrite['name'].charAt(0) === "!") {
                        overwrite['name'].substring(1, overwrite['name'].length);
                    }
                    overwriteParameters.push(overwrite);
                }
            });
            return overwriteParameters;
        };
        BxChooseResponse.prototype.prepareVisualElement = function (render, overwriteParams) {
            var visualElement = render['visualElement'];
            var visualElementParams = this.mergeJourneyParams(render['parameters'], visualElement['parameters']);
            visualElement['parameters'] = this.mergeJourneyParams(overwriteParams, visualElementParams);
            overwriteParams = overwriteParams.concat(this.getOverwriteParams(visualElement['parameters']));
            if ((typeof (visualElement['subRenderings']) != "undefined" && visualElement['subRenderings'] !== null) && (visualElement['subRenderings'].length)) {
                visualElement['subRenderings'].forEach(function (index) {
                    var subRendering = visualElement['subRenderings'][index];
                    subRendering['rendering']['visualElements'].forEach(function (index2) {
                        var subElement = subRendering['rendering']['visualElements'][index2];
                        subRendering['rendering']['visualElements'][index2] = this.prepareVisualElement(subElement, overwriteParams);
                    });
                    visualElement['subRenderings'][index] = subRendering;
                });
            }
            render['visualElement'] = visualElement;
            return render;
        };
        BxChooseResponse.prototype.propagateParams = function (acts, params) {
            for (var index in acts) {
                var act = acts[index];
                if (typeof (act['chapter']) != "undefined" && act['chapter'] !== null) {
                    var actParameters = (typeof (act['parameters']) != "undefined" && act['parameters'] !== null) ? act['parameters'] : Array();
                    params = this.mergeJourneyParams(params, actParameters);
                    act['parameters'] = params;
                    var chapter = act['chapter'];
                    if (typeof (chapter['renderings']) != "undefined" && chapter['renderings'] !== null) {
                        var chapterParameters = (typeof (chapter['parameters']) != "undefined" && chapter['parameters'] !== null) ? chapter['parameters'] : Array();
                        params = this.mergeJourneyParams(params, chapterParameters);
                        chapter['parameters'] = params;
                        for (var index1 in chapter['renderings']) {
                            var rendering = chapter['renderings'][index1];
                            if ((typeof (rendering['rendering']['visualElements']) != "undefined" && rendering['rendering']['visualElements'] !== null) && (Array.isArray(rendering['rendering']['visualElements']))) {
                                var renderingParameters = (typeof (rendering['parameters']) != "undefined" && rendering['parameters'] !== null) ? rendering['parameters'] : Array();
                                params = this.mergeJourneyParams(params, renderingParameters);
                                rendering['parameters'] = params;
                                var renderParameters = (typeof (rendering['rendering']['parameters']) != "undefined" && rendering['rendering']['parameters'] !== null) ? rendering['rendering']['parameters'] : Array();
                                params = this.mergeJourneyParams(params, renderParameters);
                                rendering['rendering']['parameters'] = params;
                                for (var index2 in rendering['rendering']['visualElements']) {
                                    var render = rendering['rendering']['visualElements'][index2];
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
        };
        BxChooseResponse.prototype.getVariantExtraInfo = function (variant, extraInfoKey, defaultExtraInfoValue) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (variant) {
                if (Array.isArray(variant.extraInfo) && variant.extraInfo.length > 0 && (typeof (variant.extraInfo[extraInfoKey]) != "undefined" && variant.extraInfo[extraInfoKey] !== null)) {
                    return variant.extraInfo[extraInfoKey];
                }
                return defaultExtraInfoValue;
            }
            return defaultExtraInfoValue;
        };
        BxChooseResponse.prototype.getExtraInfo = function (extraInfoKey, defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var variant = this.getChoiceResponseVariant(choice, count);
            return this.getVariantExtraInfo(variant, extraInfoKey);
        };
        BxChooseResponse.prototype.ucfirst = function (str) {
            if (typeof (str) !== 'string')
                return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
        BxChooseResponse.prototype.prettyPrintLabel = function (label, prettyPrint) {
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (prettyPrint) {
                label = label.replace('_', ' ');
                label = label.replace('products', '');
                label = this.ucfirst(label.trim());
            }
            return label;
        };
        BxChooseResponse.prototype.getLanguage = function (defaultLanguage) {
            if (defaultLanguage === void 0) { defaultLanguage = 'en'; }
            if (typeof (this.bxRequests[0]) != "undefined" && this.bxRequests[0] !== null) {
                return this.bxRequests[0].getLanguage();
            }
            return defaultLanguage;
        };
        BxChooseResponse.prototype.getExtraInfoLocalizedValue = function (extraInfoKey, language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (language === void 0) { language = null; }
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            var defaultValue = "";
            var jsonLabel = this.getExtraInfo(extraInfoKey, defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
            if (jsonLabel == null) {
                return this.prettyPrintLabel(defaultValue, prettyPrint);
            }
            var labels = JSON.parse(jsonLabel);
            if (language == null) {
                language = this.getLanguage();
            }
            if (Array.isArray(labels) == false) {
                return jsonLabel;
            }
            labels.forEach(function (label) {
                if (language && label.language != language) {
                    return;
                }
                if (label.value != null) {
                    return this.prettyPrintLabel(label.value, prettyPrint);
                }
            });
            return this.prettyPrintLabel(defaultValue, prettyPrint);
        };
        BxChooseResponse.prototype.getSearchMessageTitle = function (language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (language === void 0) { language = null; }
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfoLocalizedValue('search_message_title', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageDescription = function (language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (language === void 0) { language = null; }
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfoLocalizedValue('search_message_description', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageTitleStyle = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_title_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageDescriptionStyle = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_description_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageContainerStyle = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_container_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageLinkStyle = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_link_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageSideImageStyle = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_side_image_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageMainImageStyle = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_main_image_style', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageMainImage = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_main_image', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageSideImage = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_side_image', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageLink = function (language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (language === void 0) { language = null; }
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfoLocalizedValue('search_message_link', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getRedirectLink = function (language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (language === void 0) { language = null; }
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfoLocalizedValue('redirect_url', language, defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageGeneralCss = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_general_css', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getSearchMessageDisplayType = function (defaultExtraInfoValue, prettyPrint, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases) {
            if (defaultExtraInfoValue === void 0) { defaultExtraInfoValue = null; }
            if (prettyPrint === void 0) { prettyPrint = false; }
            if (choice === void 0) { choice = null; }
            if (considerRelaxation === void 0) { considerRelaxation = true; }
            if (count === void 0) { count = 0; }
            if (maxDistance === void 0) { maxDistance = 10; }
            if (discardIfSubPhrases === void 0) { discardIfSubPhrases = true; }
            return this.getExtraInfo('search_message_display_type', defaultExtraInfoValue, choice, considerRelaxation, count, maxDistance, discardIfSubPhrases);
        };
        BxChooseResponse.prototype.getLocalizedValue = function (values, key) {
            if (key === void 0) { key = null; }
            if (Array.isArray(values)) {
                var language = this.getLanguage();
                if (key === null && (typeof (values[language]) != "undefined" && values[language] !== null)) {
                    return values[language];
                }
                if (typeof (values[key]) != "undefined" && values[key] !== null) {
                    for (var lang in values[key]) {
                        var val = values[key][lang];
                        if (lang == language) {
                            return val;
                        }
                    }
                }
            }
            return values;
        };
        return BxChooseResponse;
    }());
    exports.BxChooseResponse = BxChooseResponse;
});
//# sourceMappingURL=BxChooseResponse.js.map