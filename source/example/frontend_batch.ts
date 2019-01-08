import {BxBatchClient} from "../BxBatchClient";
import {BxBatchResponse} from "../BxBatchResponse";
import {BxBatchRequest} from "../BxBatchRequest";
import {BxChooseResponse} from "../BxChooseResponse";

var request = require('request');

export class frontend_batch{
    public account: string = "dana_magento1_03"; // your account name
    public password: string = "dana_magento1_03"; // your account password
    public domain: string = "boxalino.com"; // your web-site domain (e.g.: www.abc.com)
    public logs: string[] = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "api.bx-cloud.com";
    public host: string = "boxalino.com";

    public language: string ;
    public hitCount: number;
    public choice_id: string;
    public profileIds: any = [];
    public async frontendBatch(account: string, password: string, isDev: boolean, host: string, queryText: string) {
        try {
            this.language = "de";
            this.hitCount = 5;
            this.choice_id = "home";
            this.profileIds = ["27", "71"];


            let bxClient = new BxBatchClient(account, password, this.domain);
            let bxRequest = new BxBatchRequest(this.language, this.choice_id);
            bxRequest.setMax(this.hitCount);
            bxRequest.setGroupBy("id");
            bxRequest.setOffset(0);
            bxRequest.setProfileIds(this.profileIds);

            bxClient.setRequest(bxRequest);

            let bxResponse = await bxClient.getBatchChooseResponse();

            this.logs = Array();
            //showing the output of a search request

            //#response: {customer_id=> [{field1=>value, field2=>value,..}, {field1=>value, field2=>value, ..},..], customer_id=>[{}, {}, {}]}
            let search_result = bxResponse.getHitFieldValueForProfileIds();
            let Obj = this;
            for(let id in search_result){
                let productMaps = search_result[id];
                let entity = "<h3>"+String(id)+"</h3>";
                let count = 1;
                productMaps.forEach(function(product:any){
                    for(let fieldName in product) {
                        let fieldValues = product[fieldName];
                        let fieldVal = fieldValues.join(',');
                        entity = entity + fieldName+ " : " + fieldVal;
                    }
                    entity = entity + " END OF PRODUCT " + String(count);
                    Obj.logs.push(entity)
                    count+=1
                })


            }
            //response: [customer_id=>[product1_id, product2_id, product3_id], ...]

            let search_products = bxResponse.getHitIds();
            for(let id in search_products){
                let values = search_products[id];
                let entity = "<h3>"+String(id)+"</h3>" + String(values);
                this.logs.push(entity);
            }
            let message = this.logs
            console.log(message)
        } catch (e) {
            //be careful not to print the error message on your publish web-site as sensitive information like credentials might be indicated for debug purposes
            let exception: any = e;
            if (typeof (print) === "undefined" || print !== null || print) {
                console.log(exception);
            }
        }
    }
}