import {BxSearchRequest} from "./BxSearchRequest";

let  thrift_types = require('./bxthrift/p13n_types');
import * as bxSearchRequest from "./BxSearchRequest";

class BxAutocompleteRequest {
    protected language: string;
    protected queryText: string;
    protected choiceId: string;
    protected textualSuggestionsHitCount: number;
    protected bxSearchRequest: BxSearchRequest;
    protected highlight: string;
    protected highlightPre: string;
    protected highlightPost: string;
    private propertyQueries: string[] = Array();

    protected indexId = null;

    constructor(language: string, queryText: string, textualSuggestionsHitCount: string, productSuggestionHitCount: number = 5, autocompleteChoiceId: string = 'autocomplete', searchChoiceId: string = 'search', highlight: boolean = true, highlightPre: string = '<em>', highlightPost: string = '</em>') {
        language = language;
        queryText = queryText;
        textualSuggestionsHitCount = textualSuggestionsHitCount;
        highlight = highlight;
        highlightPre = highlightPre;
        highlightPost = highlightPost;
        if (autocompleteChoiceId == null) {
            autocompleteChoiceId = 'autocomplete';
        }
        this.choiceId = autocompleteChoiceId;
        this.bxSearchRequest = new bxSearchRequest.BxSearchRequest(language, queryText, productSuggestionHitCount, searchChoiceId);
    }
    getBxSearchRequest() {
        return this.bxSearchRequest;
    }

    setBxSearchRequest(bxSearchRequest: BxSearchRequest) {
        bxSearchRequest = bxSearchRequest;
    }
    getLanguage() {
        return this.language;
    }

    setLanguage(language: string) {
        language = language;
    }

    getQuerytext() {
        return this.queryText;
    }

    setQuerytext(queryText: string) {
        queryText = queryText;
    }

    getChoiceId() {
        return this.choiceId;
    }

    setChoiceId(choiceId: string) {
        choiceId = choiceId;
    }

    getTextualSuggestionHitCount() {
        return this.textualSuggestionsHitCount;
    }

    setTextualSuggestionHitCount(textualSuggestionsHitCount: string) {
        textualSuggestionsHitCount = textualSuggestionsHitCount;
    }
    getIndexId() {
        return this.indexId;
    }

    setIndexId(indexId: string) {
        indexId = indexId;
    }

    setDefaultIndexId(indexId: string) {
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


    addPropertyQuery(field: string, hitCount: number, evaluateTotal: boolean = false) {
        let propertyQuery: any = new thrift_types.PropertyQuery();
        propertyQuery.name = field;
        propertyQuery.hitCount = hitCount;
        propertyQuery.evaluateTotal = evaluateTotal;
        this.propertyQueries.push(propertyQuery);
    }

    resetPropertyQueries() {
        this.propertyQueries = Array();
    }

    getAutocompleteThriftRequest(profileid: string, thriftUserRecord: any) {
        let autocompleteRequest =new thrift_types.AutocompleteQuery();
        autocompleteRequest.userRecord = thriftUserRecord;
        autocompleteRequest.profileId = profileid;
        autocompleteRequest.choiceId = this.choiceId;
        autocompleteRequest.searchQuery = this.bxSearchRequest.getSimpleSearchQuery();
        autocompleteRequest.searchChoiceId = this.bxSearchRequest.getChoiceId();
        autocompleteRequest.autocompleteQuery = this.getAutocompleteQuery();

        if (this.propertyQueries.length > 0 ){
            autocompleteRequest.propertyQueries = this.propertyQueries;
        }
        return autocompleteRequest;
    }
}