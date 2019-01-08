export class BxBatchResponse {

    protected bxBatchRequests: any = [];
    protected response: any ;
    protected profileItemsFromVariants: any ;
    protected bxBatchProfileContextsIds: any = [];

    constructor(response : any, bxBatchProfileIds:any = [], bxBatchRequests:any =[]) {
        this.response = response;
        this.bxBatchRequests = Array.isArray(bxBatchRequests) ? bxBatchRequests : [bxBatchRequests];
        this.bxBatchProfileContextsIds = bxBatchProfileIds;
    }

    getBatchResponse() {
        return this.response;
    }

    getHitFieldValuesByProfileId(profileId:any) {
        let TmpReturn = [];
        if (this.profileItemsFromVariants == null){
            this.getHitFieldValueForProfileIds();
        }

        if (this.profileItemsFromVariants != null &&  this.profileItemsFromVariants[profileId] != undefined){
            TmpReturn = this.profileItemsFromVariants[profileId];
        }
        return TmpReturn;
    }

    getHitFieldValueForProfileIds() {
        let profileItems:any = [];
        let key = 0;
        let TmpReturn = [];
        let obj= this;
        if (this.response == null || this.response.variants == null) {
            TmpReturn = [];
        }
        this.response.variants.forEach(function (variant: any) {
            let items = Array();
            if (variant == null || variant.searchResult == null || variant.searchResult.hitsGroups == null) {
                TmpReturn = [];
            }

            variant.searchResult.hitsGroups.forEach(function (hitGroup: any) {
                hitGroup.hits.forEach(function (hit: any) {
                    items.push(hit.values)
                });
            });
            let context = obj.bxBatchProfileContextsIds[key];
            profileItems[context] = items;
            key += 1;
        });
        this.profileItemsFromVariants = profileItems;
        TmpReturn = this.profileItemsFromVariants;
        return TmpReturn;
    }

    getHitValueByField(field:any){
        let profileHits = Array();
        let key = 0
        let Obj = this;
        this.response.variants.forEach(function(variant:any){
            let values = Array();
            variant.searchResult.hitsGroups.forEach(function(hitGroup:any){
                hitGroup.hits.forEach(function (hit:any) {
                    values.push(hit.values[field][0])
                })
            })
            let context = Obj.bxBatchProfileContextsIds[key];
            profileHits[context] = values
            key += 1
        })
        return profileHits
    }

    getHitIds(field: any = 'id') {
        let profileHits:any = [];
        let key = 0;
        let TmpReturn:any = [];
        let obj= this
        if (this.response == null || this.response.variants== null){
            TmpReturn = [];
        }
        this.response.variants.forEach(function(variant:any){
            let values = Array();
            if (variant == null || variant.searchResult == null ||variant.searchResult.hitsGroups == null) {
                TmpReturn = [];
            }
            variant.searchResult.hitsGroups.forEach(function(hitGroup:any){
                hitGroup.hits.forEach(function(hit:any){
                    values.push(hit.values[field][0]);
                })
            })

            let context = obj.bxBatchProfileContextsIds[key];
            profileHits[context] = values;
            key += 1;
        })
        TmpReturn = profileHits;
        return TmpReturn;
    }


}