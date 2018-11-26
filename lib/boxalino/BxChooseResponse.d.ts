export declare class BxChooseResponse {
    private response;
    private bxRequests;
    private notifications;
    constructor(response: any, _bxRequests?: any);
    protected notificationLog: any[];
    protected notificationMode: boolean;
    setNotificationMode(mode: any): void;
    getNotificationMode(): boolean;
    addNotification(name: any, parameters: any): void;
    getNotifications(): any;
    getResponse(): any;
    getChoiceResponseVariant(choice?: null, count?: number): any;
    getChoiceIdFromVariantIndex(variant_index: any): any;
    protected getChoiceIdResponseVariant(id?: any): any;
    getFirstPositiveSuggestionSearchResult(variant: any, maxDistance?: any): null;
    getVariantSearchResult(variant: any, considerRelaxation?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchResultHitVariable(searchResult: any, hitId: any, field: any): null;
    getSearchResultHitFieldValue(searchResult: any, hitId: any, fieldName?: any): null;
    getSearchResultHitIds(searchResult: any, fieldId?: any): any;
    getHitExtraInfo(choice?: any, hitId?: any, info_key?: any, default_value?: any, count?: any, considerRelaxation?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getHitVariable(choice?: any, hitId?: any, field?: any, count?: any, considerRelaxation?: any, maxDistance?: any, discardIfSubPhrases?: any): null;
    getHitFieldValue(choice?: any, hitId?: any, fieldName?: any, count?: any, considerRelaxation?: any, maxDistance?: any, discardIfSubPhrases?: any): null;
    getHitIds(choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, fieldId?: any, discardIfSubPhrases?: any): any;
    retrieveHitFieldValues(item: any, field: any, fields: any, hits: any): any;
    Array_keys(input: any): any[];
    getSearchHitFieldValues(searchResult: any, fields?: any): any;
    getRequestFacets(choice?: any): any;
    getFacets(choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getHitFieldValues(fields: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getFirstHitFieldValue(field?: any, returnOneValue?: any, hitIndex?: any, choice?: any, count?: any, maxDistance?: any): any;
    getTotalHitCount(choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    areResultsCorrected(choice?: any, count?: any, maxDistance?: any): boolean;
    areResultsCorrectedAndAlsoProvideSubPhrases(choice?: any, count?: any, maxDistance?: any): boolean;
    getCorrectedQuery(choice?: any, count?: any, maxDistance?: any): any;
    getResultTitle(choice?: any, count?: any, ddefault?: any): any;
    areThereSubPhrases(choice?: any, count?: any, maxBaseResults?: any): boolean;
    getSubPhrasesQueries(choice?: any, count?: any): any;
    getSubPhraseSearchResult(queryText: any, choice?: any, count?: any): null;
    getSubPhraseTotalHitCount(queryText: any, choice?: any, count?: any): any;
    getSubPhraseHitIds(queryText: any, choice?: any, count?: any, fieldId?: any): any;
    getSubPhraseHitFieldValues(queryText: any, fields: any, choice?: any, considerRelaxation?: any, count?: any): any;
    toJson(fields: any): string;
    getSearchResultExtraInfo(searchResult: any, extraInfoKey: any, defaultExtraInfoValue?: any): any;
    mergeJourneyParams(parentParams: any, childParams: any): any;
    getCPOJourney(choice_id?: any): any;
    getStoryLine(choice_id?: any): any;
    getParameterValuesForVisualElement(element: any, paramName: any): null;
    getNarrativeDependencies(choice_id?: any): any;
    getNarratives(choice_id?: any): any[];
    getOverwriteParams(parameters: any): any;
    prepareVisualElement(render: any, overwriteParams: any): any;
    propagateParams(acts: any, params: any): any;
    getVariantExtraInfo(variant: any, extraInfoKey: any, defaultExtraInfoValue?: any): any;
    getExtraInfo(extraInfoKey: any, defaultExtraInfoValue?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    ucfirst(str: any): string;
    prettyPrintLabel(label: any, prettyPrint?: any): any;
    getLanguage(defaultLanguage?: any): any;
    getExtraInfoLocalizedValue(extraInfoKey: any, language?: any, defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageTitle(language?: any, defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: number, maxDistance?: number, discardIfSubPhrases?: any): any;
    getSearchMessageDescription(language?: any, defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageTitleStyle(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageDescriptionStyle(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageContainerStyle(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageLinkStyle(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageSideImageStyle(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageMainImageStyle(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageMainImage(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageSideImage(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageLink(language?: any, defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getRedirectLink(language?: any, defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageGeneralCss(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getSearchMessageDisplayType(defaultExtraInfoValue?: any, prettyPrint?: any, choice?: any, considerRelaxation?: any, count?: any, maxDistance?: any, discardIfSubPhrases?: any): any;
    getLocalizedValue(values: any, key?: any): any;
}