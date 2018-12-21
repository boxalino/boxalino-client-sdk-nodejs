import { BxChooseResponse } from "./BxChooseResponse";
export declare class BxAutocompleteResponse {
    private response;
    private bxAutocompleteRequest;
    constructor(response: any, bxAutocompleteRequest?: any);
    getResponse(): any;
    getPrefixSearchHash(): string | null;
    getTextualSuggestions(): any;
    suggestionIsInGroup1(groupName: string, suggestion: string): boolean;
    suggestionIsInGroup(groupName: string, suggestion: string): boolean;
    reOrderSuggestions(suggestions: string[]): string[];
    protected getTextualSuggestionHit(suggestion: string): null;
    getTextualSuggestionTotalHitCount(suggestion: string): any;
    getSearchRequest(): any;
    getTextualSuggestionFacets(suggestion: string): any;
    getTextualSuggestionHighlighted(suggestion: string): any;
    getBxSearchResponse(textualSuggestion: string): BxChooseResponse;
    getPropertyHits(field: any): any[];
    getPropertyHit(field: string, hitValue: string): null;
    getPropertyHitValues(field: string): string[];
    getPropertyHitValueLabel(field: string, hitValue: string): any;
    getPropertyHitValueTotalHitCount(field: string, hitValue: string): any;
    getTextualSuggestions1(): any;
}
