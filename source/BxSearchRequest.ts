import {BxRequest} from "./BxRequest";

export class BxSearchRequest extends BxRequest{

    constructor(language: string, queryText: string, max: number = 10, choiceId: any = null) {
        if (choiceId == null) {
            choiceId = 'search';
        }
        let _bxRequest = super(language, choiceId, max, 0);
        this.setQuerytext(queryText);
    }
}