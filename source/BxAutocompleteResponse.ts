import {Md5} from "md5-typescript";
import {BxChooseResponse} from "./BxChooseResponse";

export class BxAutocompleteResponse {
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
		//return this.reOrderSuggestions(suggestions);
        return suggestions;
	}

	suggestionIsInGroup1(groupName: string, suggestion: string) {
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

    suggestionIsInGroup(groupName: string, suggestion: string) {
        let hit: any = this.getTextualSuggestionHit(suggestion);
        if(hit.highlighted !== null) {
            switch (groupName) {
                case 'highlighted-beginning':
                    return hit.highlighted != "" && hit.highlighted.indexOf(this.bxAutocompleteRequest.getHighlightPre()) === 0;
                case 'highlighted-not-beginning':
                    return hit.highlighted != "" && hit.highlighted.indexOf(this.bxAutocompleteRequest.getHighlightPre()) !== 0;
                default:
                    return (hit.highlighted == "");
            }
        }
        else{
        	return false;
		}
    }


	reOrderSuggestions(suggestions: string[]) {
        let queryText: any = this.getSearchRequest().getQuerytext();
		//let queryTextSearchRequest: any = this.getSearchRequest();
        //let queryText: any = queryTextSearchRequest.getQueryText();

		let groupNames: string[] = Array('highlighted-beginning', 'highlighted-not-beginning', 'others');
		let groupValues: any = Array();
		for (let k in groupNames) {
			let groupName = groupNames[k];
			if (groupValues[k] == null) {
				groupValues[k] = Array();
			}
			//suggestions.forEach(function (suggestion: string) {
             //   if (this.suggestionIsInGroup(groupName, suggestion)) {
              //      groupValues[k].push(suggestion);
              //  }
			//});
			for(let suggestion in suggestions){
                if (this.suggestionIsInGroup(groupName, suggestion)) {
                    groupValues[k].push(suggestion);
                }
			}
		}

		let final: string[] = Array();
		groupValues.forEach(function (values: string[]) {
			values.forEach(function (value: string) {
				final.push(value);
			});
		});
		return final;
	}

	protected getTextualSuggestionHit(suggestion: string) {
		let temp = this.getResponse().hits;
		var res: any = null;

        temp.forEach(function (hit: any) {
           if (hit.suggestion == suggestion) {
               res = hit;
           }
       });
        return res;
       // throw new Error("unexisting textual suggestion provided " + suggestion);
	}

	getTextualSuggestionTotalHitCount(suggestion: string) {
		let hit: any = this.getTextualSuggestionHit(suggestion);
		return hit.searchResult.totalHitCount;
	}

	getSearchRequest() {
		return this.bxAutocompleteRequest.getBxSearchRequest();
	}

	getTextualSuggestionFacets(suggestion: string) {
		let hit: any = this.getTextualSuggestionHit(suggestion);

		let facets = this.getSearchRequest().getFacets();
		if (facets == null || facets == "") {
			return null;
		}
		facets.setSearchResults(hit.searchResult);
		return facets;
	}

	getTextualSuggestionHighlighted(suggestion: string) {
		let hit: any = this.getTextualSuggestionHit(suggestion);
		if (hit.highlighted == null || hit.highlighted == "" ) {
			return suggestion;
		}
		return hit.highlighted;
	}

	getBxSearchResponse(textualSuggestion: string) {
		let suggestionHit: any = this.getTextualSuggestionHit(textualSuggestion);
		let searchResult: any = textualSuggestion == null ? this.getResponse().prefixSearchResult : suggestionHit.searchResult;
		return new BxChooseResponse(searchResult, this.bxAutocompleteRequest.getBxSearchRequest())
	}

	getPropertyHits(field: any) {
		let tmpRet: any = Array();
		let response = this.getResponse().propertyResults;
		response.forEach(function (propertyResult: any) {
			if (propertyResult.name == field) {
                tmpRet =  propertyResult.hits;
			}
		});
		return tmpRet;
	}

	getPropertyHit(field: string, hitValue: string) {
		let proHit: any = this.getPropertyHits(field);
		let tmpRet: any = null;
		proHit.forEach(function (hit: any) {
			if (hit.value == hitValue) {
                tmpRet =  hit;
			}
		});
		return tmpRet;
	}

	getPropertyHitValues(field: string) {
		let hitValues: string[] = Array();
		let proHit: any = this.getPropertyHits(field);
		proHit.forEach(function (hit: any) {
			hitValues.push(hit.value);
		});
		return hitValues;
	}

	getPropertyHitValueLabel(field: string, hitValue: string) {
		let hit: any = this.getPropertyHit(field, hitValue);
		if (hit != null) {
			return hit.label;
		}
		return null;
	}

	getPropertyHitValueTotalHitCount(field: string, hitValue: string) {
		let hit: any = this.getPropertyHit(field, hitValue);
		if (hit != null) {
			return hit.totalHitCount;
		}
		return null;
	}

    getTextualSuggestions1() {
        let suggestions: any = Array();
        this.getResponse().hits.forEach(function (hit: any) {
            if (typeof (suggestions[hit.suggestion]) != "undefined" && suggestions[hit.suggestion] !== null) return;
            suggestions[hit.suggestion] = hit.suggestion;
        });
        return suggestions;
    }
}