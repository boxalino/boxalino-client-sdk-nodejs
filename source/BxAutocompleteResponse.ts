import {Md5} from "md5-typescript";
import * as bxChooseResponse from "./BxChooseResponse";

class BxAutocompleteResponse {
	private response: any;
	private bxAutocompleteRequest: any;
	constructor(response: any, bxAutocompleteRequest: any = null) {
		this.response = response;
		this.bxAutocompleteRequest = bxAutocompleteRequest;
	}
	
	getResponse() {
		return this.response;
	}
	getPrefixSearchHash() {
		if (this.getResponse().prefixSearchResult.totalHitCount > 0) {
			let mdVal=Md5.init(this.getResponse().prefixSearchResult.queryText);
			return mdVal.substring(0, 10);
		} else {
			return null;
		}
	}

	getTextualSuggestions() {
		let suggestions: any = Array();
		this.getResponse().hits.forEach(function (hit: any) {
			if (typeof (suggestions[hit.suggestion]) != "undefined" && suggestions[hit.suggestion] !== null) return;
			suggestions[hit.suggestion] = hit.suggestion;
		});
		return this.reOrderSuggestions(suggestions);
	}

	suggestionIsInGroup(groupName: any, suggestion: any) {
		let hit: any = this.getTextualSuggestionHit(suggestion);
		switch (groupName) {
			case 'highlighted-beginning':
				return hit.highlighted != "" && hit.highlighted.indexOf(this.bxAutocompleteRequest.getHighlightPre()) === 0;
			case 'highlighted-not-beginning':
				return hit.highlighted != "" && hit.highlighted.indexOf(this.bxAutocompleteRequest.getHighlightPre()) !== 0;
			default:
				return (hit.highlighted == "");
		}
	}

	reOrderSuggestions(suggestions: any) {
		let queryText: any = this.getSearchRequest().getQueryText();

		let groupNames: any = Array('highlighted-beginning', 'highlighted-not-beginning', 'others');
		let groupValues: any = Array();
		for (let k in groupNames) {
			let groupName = groupNames[k];
			if (groupValues[k] == null) {
				groupValues[k] = Array();
			}
			suggestions.forEach(function (suggestion: any) {
				if (this.suggestionIsInGroup(groupName, suggestion)) {
					groupValues[k].push(suggestion);
				}
			});
		}

		let final: any = Array();
		groupValues.forEach(function (values: any) {
			values.forEach(function (value: any) {
				final.push(value);
			});
		});
		return final;
	}

	protected getTextualSuggestionHit(suggestion: any) {
		let temp = this.getResponse().hits;
		temp.forEach(function (hit: any) {
			if (hit.suggestion == suggestion) {
				return hit;
			}
		});
		throw new Error("unexisting textual suggestion provided " + suggestion);
	}

	getTextualSuggestionTotalHitCount(suggestion: any) {
		let hit: any = this.getTextualSuggestionHit(suggestion);
		return hit.searchResult.totalHitCount;
	}

	getSearchRequest() {
		return this.bxAutocompleteRequest.getBxSearchRequest();
	}

	getTextualSuggestionFacets(suggestion: any) {
		let hit: any = this.getTextualSuggestionHit(suggestion);

		let facets = this.getSearchRequest().getFacets();
		if (facets == null || facets == "") {
			return null;
		}
		facets.setSearchResults(hit.searchResult);
		return facets;
	}

	getTextualSuggestionHighlighted(suggestion: any) {
		let hit: any = this.getTextualSuggestionHit(suggestion);
		if (hit.highlighted == "") {
			return suggestion;
		}
		return hit.highlighted;
	}

	getBxSearchResponse(textualSuggestion: any = null) {
		let suggestionHit: any = this.getTextualSuggestionHit(textualSuggestion);
		let searchResult: any = textualSuggestion == null ? this.getResponse().prefixSearchResult : suggestionHit.searchResult;
		return new bxChooseResponse.BxChooseResponse(searchResult, this.bxAutocompleteRequest.getBxSearchRequest())
	}

	getPropertyHits(field: any) {
		let response = this.getResponse().propertyResults;
		response.forEach(function (propertyResult: any) {
			if (propertyResult.name == field) {
				return propertyResult.hits;
			}
		});
		return Array();
	}

	getPropertyHit(field: any, hitValue: any) {
		let proHit: any = this.getPropertyHits(field);
		proHit.forEach(function (hit: any) {
			if (hit.value == hitValue) {
				return hit;
			}
		});
		return null;
	}

	getPropertyHitValues(field: any) {
		let hitValues: any = Array();
		let proHit: any = this.getPropertyHits(field);
		proHit.forEach(function (hit: any) {
			hitValues.push(hit.value);
		});
		return hitValues;
	}

	getPropertyHitValueLabel(field: any, hitValue: any) {
		let hit: any = this.getPropertyHit(field, hitValue);
		if (hit != null) {
			return hit.label;
		}
		return null;
	}

	getPropertyHitValueTotalHitCount(field: any, hitValue: any) {
		let hit: any = this.getPropertyHit(field, hitValue);
		if (hit != null) {
			return hit.totalHitCount;
		}
		return null;
	}
}