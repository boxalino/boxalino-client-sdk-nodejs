export declare class BxAutocompleteRequest {
    protected language: string;
    protected queryText: string;
    protected choiceId: string;
    protected textualSuggestionsHitCount: number;
    protected bxSearchRequest: any;
    protected highlight: boolean;
    protected highlightPre: string;
    protected highlightPost: string;
    private propertyQueries;
    protected indexId: null;
    constructor(language: string, queryText: string, textualSuggestionsHitCount: number, productSuggestionHitCount?: number, autocompleteChoiceId?: string, searchChoiceId?: string, highlight?: boolean, highlightPre?: string, highlightPost?: string);
    getBxSearchRequest(): any;
    setBxSearchRequest(bxSearchRequest: any): void;
    getLanguage(): string;
    setLanguage(language: any): void;
    getQuerytext(): string;
    setQuerytext(queryText: any): void;
    getChoiceId(): string;
    setChoiceId(choiceId: any): void;
    getTextualSuggestionHitCount(): number;
    setTextualSuggestionHitCount(textualSuggestionsHitCount: any): void;
    getIndexId(): null;
    setIndexId(indexId: any): void;
    setDefaultIndexId(indexId: any): void;
    getHighlight(): boolean;
    getHighlightPre(): string;
    getHighlightPost(): string;
    private getAutocompleteQuery;
    addPropertyQuery(field: any, hitCount: any, evaluateTotal?: any): void;
    resetPropertyQueries(): void;
    getAutocompleteThriftRequest(profileid: any, thriftUserRecord: any): any;
}