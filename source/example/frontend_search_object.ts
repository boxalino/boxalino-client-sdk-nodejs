import {BxClient} from "../BxClient";
import {BxRequest} from "../BxRequest";
import {BxChooseResponse} from "../BxChooseResponse";
import {BxFacets} from "../BxFacets";
import {BxAutocompleteResponse} from "../BxAutocompleteResponse";
import {BxRecommendationRequest} from "../BxRecommendationRequest";
import {BxSearchRequest} from "../BxSearchRequest";



var request = require('request');

export class frontend_search_object{

    public account: string = "boxalino_automated_tests2"; // your account name
    public password: string = "boxalino_automated_tests2"; // your account password
    public domain: string = ""; // your web-site domain (e.g.: www.abc.com)
    public logs: any = Array(); //optional, just used here in example to collect logs
    public isDev: boolean = false;
    public bxHost: string = "cdn.bx-cloud.com";
    public host: string = "mooris.ch";

    public language: string ;
    public hitCount: number;
    public choice_id: string;
    public queryText: string;
    public selectedValue: any;
    public profileIds: any = Array();
    public bxResponse: BxChooseResponse;
    public async frontendSearchObject(account: string, password: string, isDev: boolean, host: string) {
        try {
            this.account = account;
            this.password = password;
            this.host = host;
            this.language = "en";
            this.hitCount = 10;
            this.choice_id = "search";
            this.queryText = "";
            this.selectedValue = null;

            let bxClient = new BxClient(account, password, this.domain);
            let bxRequest = new BxSearchRequest(this.language,this.queryText, this.hitCount,  this.choice_id);
            bxRequest.setOffset(0);

            //facetsSet = prepare_facets(selectedValue, facetFields)
            let facetsSet = new BxFacets();
            facetsSet.addPriceRangeFacet(this.selectedValue);
            facetsSet.addFacet("products_color", this.selectedValue);

            bxRequest.setFacets(facetsSet);
            bxRequest.setGroupFacets(true);

            bxClient.addRequest(bxRequest);

            this.bxResponse = await bxClient.getResponse()
            let facets = this.bxResponse.getFacets()

            let collection = facets.getFacetsAsObjectsCollection("en")
            let renderedCollection = this.render_facets_from_collection(collection, facets);
            this.logs.push(renderedCollection);

            let message = this.logs
            console.log(message);
        } catch (e) {
            //be careful not to print the error message on your publish web-site as sensitive information like credentials might be indicated for debug purposes
            let exception: any = e;
            if (typeof (print) === "undefined" || print !== null || print) {
                console.log(exception);
            }
        }
    }

    render_facets_from_collection(collection: any, facets: any){

        let logs:any = [];
        let icon = '';
        for(let field in collection){
            let facetObject = collection[field];
            logs.push("----------------------" + String(field) + " - " + String(facetObject.label )+ "---------------------------");
            if(facetObject.hidden || facetObject.optionValues == null) {
                logs.push("facet is hidden or has no output");
                return logs;
            }

            if(facetObject.icon == null){
                let icon = '';
            }else {
                let icon = "<i class=\"" + facetObject.icon + "\"></i>";
            }
            logs.push("<div class=\"container\">");
            logs.push("<div class=\"header\">"+ String(icon) + " <span>"+ String(facetObject.label )+ "</span></div>");
            logs.push("<div class=\"content\">");
            let showedMoreLink = false
            let showCounter = facetObject.showCounter;
            if(facetObject.optionValues != null){
                for(let permalink in facetObject.optionValues){
                    let optionValue = facetObject.optionValues[permalink];
                    if(facetObject.type == "ranged"){
                        facets.getPriceRanges().forEach ( function(fieldValue:any) {
                            let range = "<a href=\"?bx_price=" + facets.getPriceValueParameterValue(fieldValue) + "\">" + facets.getPriceValueLabel(fieldValue) + "</a> (" + String(facets.getPriceValueCount(fieldValue)) + ")"
                            if (facets.isPriceValueSelected(fieldValue)) {
                                range = range + "<a href=\"?\">[X]</a>"
                            }
                            logs.push(range)
                        });
                    }else{
                        let facetOption = optionValue;
                        let postfix="";
                        if(showCounter){
                            let hitcount = facetOption.hitCount;
                            postfix = " (" + String(hitcount )+ ")";
                        }

                        if(facetOption.selected){
                            postfix = String(postfix )+ "<a href=\"?\">[X]</a>";
                        }

                        if(facetOption.icon ==  null){
                            facetOption.icon="<M>";
                        }
                        if(!showedMoreLink && facetOption.hidden){
                            showedMoreLink = true;
                            logs.push("<li class=\"show_more_values\">more values</li>");
                        }
                        logs.push("<li class=\"additional_values_\"><a href=\"?bx_" + field + "=" + String(facetOption.stringValue ) + "\">" +  String(facetOption.icon) + facetOption.label + "</a>"+ postfix +"</li>");
                    }
                }
            }
            logs.push("</ul></div></div>");
            logs.join("<br/>");
        }


        return logs

    }

}