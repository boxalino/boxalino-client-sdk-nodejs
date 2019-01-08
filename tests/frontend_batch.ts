import "mocha";
import * as assert from "assert";
import * as _frontendBatch from "../lib/boxalino/example/frontend_batch";

describe("frontend_batch", () => {
    let account: string = "dana_magento1_03"; // your account name
    let password: string = "dana_magento1_03"; // your account password
    let isDev: boolean = false;
    let bxHost: string = "cdn.bx-cloud.com";
    let queryText: string = "watch";
    it("test", async () => {
        let _frontendBatchSearch = new _frontendBatch.frontend_batch();
        //testing the result of the frontend search basic case
        await _frontendBatchSearch.frontendBatch(account, password, isDev, bxHost, queryText);
    }).timeout(5000);
});