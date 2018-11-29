let thrift_types = require('./bxthrift/p13n_types');
import {BxSearchRequest} from "./BxSearchRequest";

export class BxAutocompleteRequest {
    protected language: string;
    protected queryText: string;
    protected choiceId: string;
    protected textualSuggestionsHitCount: number;
    protected bxSearchRequest: any;
    protected highlight: boolean = true;
    protected highlightPre: string;
    protected highlightPost: string;
    private propertyQueries: any = Array();

    protected indexId = null;

    constructor(language: string, queryText: string, textualSuggestionsHitCount: number, productSuggestionHitCount: number = 5, autocompleteChoiceId: string = 'autocomplete', searchChoiceId: string = 'search', highlight: boolean = true, highlightPre: string = '<em>', highlightPost: string = '</em>') {
        language = language;
        queryText = queryText;
        textualSuggestionsHitCount = textualSuggestionsHitCount;
        highlight = highlight;
        highlightPre = highlightPre;
        highlightPost = highlightPost;
        if (autocompleteChoiceId == null || autocompleteChoiceId=="") {
            autocompleteChoiceId = 'autocomplete';
        }
        let choiceId: any = autocompleteChoiceId;
        this.bxSearchRequest = new BxSearchRequest(language, queryText, productSuggestionHitCount, searchChoiceId);
    }
    getBxSearchRequest() {
        return this.bxSearchRequest;
    }

    setBxSearchRequest(bxSearchRequest: any) {
        bxSearchRequest = bxSearchRequest;
    }
    getLanguage() {
        return this.language;
    }

    setLanguage(language: any) {
        language = language;
    }

    getQuerytext() {
        return this.queryText;
    }

    setQuerytext(queryText: any) {
        queryText = queryText;
    }

    getChoiceId() {
        return this.choiceId;
    }

    setChoiceId(choiceId: any) {
        choiceId = choiceId;
    }

    getTextualSuggestionHitCount() {
        return this.textualSuggestionsHitCount;
    }

    setTextualSuggestionHitCount(textualSuggestionsHitCount: any) {
        textualSuggestionsHitCount = textualSuggestionsHitCount;
    }
    getIndexId() {
        return this.indexId;
    }

    setIndexId(indexId: any) {
        indexId = indexId;
    }

    setDefaultIndexId(indexId: any) {
        if (indexId == null) {
            this.setIndexId(indexId);
        }
        this.bxSearchRequest.setDefaultIndexId(indexId);
    }

    getHighlight() {
        return this.highlight;
    }

    getHighlightPre() {
        return this.highlightPre;
    }

    getHighlightPost() {
        return this.highlightPost;
    }

    private getAutocompleteQuery() {
        let autocompleteQuery: any = new thrift_types.AutocompleteQuery();
        autocompleteQuery.indexId = this.getIndexId();
        autocompleteQuery.language = this.language;
        autocompleteQuery.queryText = this.queryText;
        autocompleteQuery.suggestionsHitCount = this.textualSuggestionsHitCount;
        autocompleteQuery.highlight = this.highlight;
        autocompleteQuery.highlightPre = this.highlightPre;
        autocompleteQuery.highlightPost = this.highlightPost;
        return autocompleteQuery;
    }


    addPropertyQuery(field: any, hitCount: any, evaluateTotal: any = false) {
        let propertyQuery: any = new thrift_types.PropertyQuery();
        propertyQuery.name = field;
        propertyQuery.hitCount = hitCount;
        propertyQuery.evaluateTotal = evaluateTotal;
        this.propertyQueries.push(propertyQuery);
    }

    resetPropertyQueries() {
        this.propertyQueries = Array();
    }

    getAutocompleteThriftRequest(profileid: any, thriftUserRecord: any) {
        let autocompleteRequest = new thrift_types.AutocompleteQuery();
        autocompleteRequest.userRecord = thriftUserRecord;
        autocompleteRequest.profileId = profileid;
        autocompleteRequest.choiceId = this.choiceId;
        autocompleteRequest.searchQuery = this.bxSearchRequest.getSimpleSearchQuery();
        autocompleteRequest.searchChoiceId = this.bxSearchRequest.getChoiceId();
        autocompleteRequest.autocompleteQuery = this.getAutocompleteQuery();

        if (this.propertyQueries.length > 0) {
            autocompleteRequest.propertyQueries = this.propertyQueries;
        }
        return autocompleteRequest;
    }
}