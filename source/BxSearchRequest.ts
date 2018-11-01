import * as bxRequestModule from "./BxRequest";

export class BxSearchRequest extends bxRequestModule.BxRequest{

    constructor(language: any, queryText: any, max: any = 10, choiceId: any = null) {
        if (choiceId == null) {
            choiceId = 'search';
        }
        let _bxRequest = super(language, choiceId, max, 0);
        this.setQuerytext(queryText);
    }
}