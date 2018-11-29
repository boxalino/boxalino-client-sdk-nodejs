import * as bxRequestModule from "./BxRequest";

export class BxSearchRequest extends bxRequestModule.BxRequest{

    constructor(language: string, queryText: string, max: number = 10, choiceId: string ="") {
        if (choiceId == null) {
            choiceId = 'search';
        }
        let _bxRequest = super(language, choiceId, max, 0);
        this.setQuerytext(queryText);
    }
}