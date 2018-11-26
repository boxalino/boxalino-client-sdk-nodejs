import samchon = require("samchon");
import { BxClient } from "./BxClient";
export declare class BxData {
    URL_VERIFY_CREDENTIALS: string;
    URL_XML: string;
    URL_PUBLISH_CONFIGURATION_CHANGES: string;
    URL_ZIP: string;
    URL_EXECUTE_TASK: string;
    private bxClient;
    private languages;
    private isDev;
    private isDelta;
    private sources;
    private delimiter;
    private sourceIdContainers;
    private globalValidate;
    private ftpSources;
    private httpSources;
    private host;
    private owner;
    constructor(bxClient: BxClient, languages?: any, isDev?: boolean, isDelta?: boolean);
    setLanguages(languages: any): void;
    getLanguages(): any;
    setDelimiter(delimiter: any): void;
    addMainXmlItemFile(filePath: any, itemIdColumn: any, xPath?: any, encoding?: any, sourceId?: any, container?: any, validate?: any): any;
    addMainCSVItemFile(filePath: any, itemIdColumn: any, encoding?: any, delimiter?: any, enclosure?: any, escape?: any, lineSeparator?: any, sourceId?: any, container?: any, validate?: any): any;
    addMainCSVCustomerFile(filePath: any, itemIdColumn: any, encoding?: any, delimiter?: any, enclosure?: any, escape?: any, lineSeparator?: any, sourceId?: any, container?: any, validate?: any): any;
    addCSVItemFile(filePath: any, itemIdColumn: any, encoding?: any, delimiter?: any, enclosure?: any, escape?: any, lineSeparator?: any, sourceId?: any, container?: any, validate?: any, maxLength?: any): string;
    addXMLItemFile(filePath: any, itemIdColumn: any, xPath: any, encoding?: any, sourceId?: any, container?: any, validate?: any, maxLength?: any): string;
    addCSVCustomerFile(filePath: any, itemIdColumn: any, encoding?: any, delimiter?: any, enclosure?: any, escape?: any, lineSeparator?: any, sourceId?: any, container?: any, validate?: any, maxLength?: any): string;
    addCategoryFile(filePath: any, categoryIdColumn: any, parentIdColumn: any, categoryLabelColumns: any, encoding?: any, delimiter?: any, enclosure?: any, escape?: any, lineSeparator?: any, sourceId?: any, container?: any, validate?: any): string;
    addResourceFile(filePath: any, categoryIdColumn: any, labelColumns: any, encoding?: any, delimiter?: any, enclosure?: any, escape?: any, lineSeparator?: any, sourceId?: any, container?: any, validate?: any, maxLength?: any): string;
    /**
     * Adding an additional table file with the content as it has it
     *
     * @param filePath
     * @param container - name of the entity (customers, products, transactions are accepted)
     * @param column - 1st column or reference column
     * @param columns - field names or labels
     * @param int maxLength
     * @return string
     * @throws Error
     */
    addExtraTableToEntity(filePath: any, container: any, column: any, columns: any, maxLength?: any): string;
    setCSVTransactionFile(filePath: any, orderIdColumn: any, productIdColumn: any, customerIdColumn: any, orderDateIdColumn: any, totalOrderValueColumn: any, productListPriceColumn: any, productDiscountedPriceColumn: any, productIdField?: any, customerIdField?: any, productsContainer?: any, customersContainer?: any, format?: any, encoding?: any, delimiter?: any, enclosure?: any, escape?: any, lineSeparator?: any, container?: any, sourceId?: any, validate?: any): string;
    addSourceFile(filePath: any, sourceId: any, container: any, type: any, format?: any, params?: any, validate?: any): string;
    decodeSourceKey(sourceKey: any): any;
    encodesourceKey(container: any, sourceId: any): string;
    getSourceCSVRow(container: any, sourceId: any, row?: any, maxRow?: any): any;
    setGlobalValidate(globalValidate: any): void;
    validateSource(container: any, sourceId: any): void;
    validateColumnExistance(container: any, sourceId: any, col: any): void;
    addSourceIdField(sourceKey: any, col: any, format: any, referenceSourceKey?: any, validate?: any): void;
    addSourceTitleField(sourceKey: any, colMap: any, referenceSourceKey?: any, validate?: any): void;
    addSourceDescriptionField(sourceKey: any, colMap: any, referenceSourceKey?: any, validate?: any): void;
    addSourceListPriceField(sourceKey: any, col: any, referenceSourceKey?: any, validate?: any): void;
    addSourceDiscountedPriceField(sourceKey: any, col: any, referenceSourceKey?: any, validate?: any): void;
    addSourceLocalizedTextField(sourceKey: any, fieldName: any, colMap: any, referenceSourceKey?: any, validate?: any): void;
    addSourceStringField(sourceKey: any, fieldName: any, col: any, referenceSourceKey?: any, validate?: any): void;
    addSourceNumberField(sourceKey: any, fieldName: any, col: any, referenceSourceKey?: any, validate?: any): void;
    setCategoryField(sourceKey: any, col: any, referenceSourceKey?: any, validate?: any): void;
    addSourceField(sourceKey: any, fieldName: any, type: any, localized: any, colMap: any, referenceSourceKey?: any, validate?: any): void;
    setFieldIsMultiValued(sourceKey: any, fieldName: any, multiValued?: any): void;
    addSourceCustomerGuestProperty(sourceKey: any, parameterValue: any): void;
    addSourceParameter(sourceKey: any, parameterName: any, parameterValue: any): void;
    addFieldParameter(sourceKey: any, fieldName: any, parameterName: any, parameterValue: any): void;
    setFtpSource(sourceKey: any, host?: any, port?: any, user?: any, password?: any, remoteDir?: any, protocol?: any, type?: any, logontype?: any, timezoneoffset?: number, pasvMode?: string, maximumMultipeConnections?: number, encodingType?: string, bypassProxy?: number, syncBrowsing?: number): void;
    setHttpSource(sourceKey: any, webDirectory: any, user?: any, password?: any, header?: any): void;
    getXML(): samchon.library.XML;
    protected callAPI(fields: any, url: any, temporaryFilePath?: any, timeout?: any): any;
    getError(responseBody: any): any;
    checkResponseBody(responseBody: any, url: any): any;
    pushDataSpecifications(ignoreDeltaException?: boolean): any;
    checkChanges(): void;
    publishChanges(): void;
    publishOwnerChanges(publish?: boolean): any;
    verifyCredentials(): any;
    alreadyExistingSourceId(sourceId: any, container: any): boolean;
    getUnusedSourceIdPostFix(sourceId: any, container: any): any;
    getSourceIdFromFileNameFromPath(filePath: any, container: any, maxLength?: any, withoutExtension?: any): any;
    getFileNameFromPath(filePath: any, withoutExtension?: any): any;
    getFiles(): any;
    createZip(temporaryFilePath?: any, name?: any, clearFiles?: any): any;
    pushData(temporaryFilePath?: any, timeout?: any, clearFiles?: any): any;
    getTaskExecuteUrl(taskName: any): string;
    publishChoices(isTest?: any, taskName?: any): void;
    prepareCorpusIndex(taskName?: any): void;
    prepareAutocompleteIndex(fields: any, taskName?: any): void;
    private file_get_contents;
    private file_exists;
}
