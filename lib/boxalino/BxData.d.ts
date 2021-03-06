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
    setLanguages(languages: string): void;
    getLanguages(): any;
    setDelimiter(delimiter: string): void;
    addMainXmlItemFile(filePath: string, itemIdColumn: string, xPath?: any, encoding?: string, sourceId?: string, container?: string, validate?: boolean): any;
    addMainCSVItemFile(filePath: string, itemIdColumn: string, encoding?: string, delimiter?: string, enclosure?: any, escape?: any, lineSeparator?: any, sourceId?: any, container?: any, validate?: any): any;
    addMainCSVCustomerFile(filePath: string, itemIdColumn: string, encoding?: string, delimiter?: string, enclosure?: string, escape?: string, lineSeparator?: string, sourceId?: string, container?: string, validate?: boolean): any;
    addCSVItemFile(filePath: string, itemIdColumn: string, encoding?: string, delimiter?: string, enclosure?: string, escape?: any, lineSeparator?: any, sourceId?: any, container?: string, validate?: boolean, maxLength?: number): string;
    addXMLItemFile(filePath: string, itemIdColumn: string, xPath: any, encoding?: string, sourceId?: any, container?: string, validate?: any, maxLength?: any): string;
    addCSVCustomerFile(filePath: string, itemIdColumn: string, encoding?: string, delimiter?: string, enclosure?: string, escape?: any, lineSeparator?: any, sourceId?: any, container?: string, validate?: boolean, maxLength?: number): string;
    addCategoryFile(filePath: string, categoryIdColumn: string, parentIdColumn: string, categoryLabelColumns: any, encoding?: string, delimiter?: string, enclosure?: string, escape?: string, lineSeparator?: string, sourceId?: string, container?: string, validate?: boolean): string;
    addResourceFile(filePath: string, categoryIdColumn: string, labelColumns: any, encoding?: any, delimiter?: string, enclosure?: string, escape?: string, lineSeparator?: string, sourceId?: any, container?: string, validate?: boolean, maxLength?: number): string;
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
    addExtraTableToEntity(filePath: string, container: string, column: string, columns: string[], maxLength?: number): string;
    setCSVTransactionFile(filePath: string, orderIdColumn: string, productIdColumn: string, customerIdColumn: string, orderDateIdColumn: string, totalOrderValueColumn: string, productListPriceColumn: string, productDiscountedPriceColumn: string, productIdField?: string, customerIdField?: string, productsContainer?: string, customersContainer?: string, format?: string, encoding?: string, delimiter?: string, enclosure?: string, escape?: string, lineSeparator?: string, container?: string, sourceId?: string, validate?: boolean): string;
    addSourceFile(filePath: string, sourceId: string, container: string, type: string, format?: string, params?: any, validate?: boolean): string;
    decodeSourceKey(sourceKey: string): string[];
    encodesourceKey(container: string, sourceId: string): string;
    getSourceCSVRow(container: string, sourceId: string, row?: number, maxRow?: number): any;
    setGlobalValidate(globalValidate: boolean): void;
    validateSource(container: string, sourceId: string): void;
    validateColumnExistance(container: string, sourceId: string, col: string): void;
    addSourceIdField(sourceKey: string, col: string, format: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceTitleField(sourceKey: string, colMap: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceDescriptionField(sourceKey: string, colMap: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceListPriceField(sourceKey: string, col: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceDiscountedPriceField(sourceKey: string, col: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceLocalizedTextField(sourceKey: string, fieldName: string, colMap: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceStringField(sourceKey: string, fieldName: string, col: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceNumberField(sourceKey: string, fieldName: string, col: string, referenceSourceKey?: any, validate?: boolean): void;
    setCategoryField(sourceKey: string, col: string, referenceSourceKey?: any, validate?: boolean): void;
    addSourceField(sourceKey: string, fieldName: string, type: string, localized: boolean, colMap: string, referenceSourceKey?: any, validate?: boolean): void;
    setFieldIsMultiValued(sourceKey: string, fieldName: string, multiValued?: boolean): void;
    addSourceCustomerGuestProperty(sourceKey: string, parameterValue: string): void;
    addSourceParameter(sourceKey: string, parameterName: string, parameterValue: string): void;
    addFieldParameter(sourceKey: string, fieldName: string, parameterName: string, parameterValue: string): void;
    setFtpSource(sourceKey: string, host?: string, port?: number, user?: any, password?: any, remoteDir?: any, protocol?: number, type?: number, logontype?: number, timezoneoffset?: number, pasvMode?: string, maximumMultipeConnections?: number, encodingType?: string, bypassProxy?: number, syncBrowsing?: number): void;
    setHttpSource(sourceKey: string, webDirectory: string, user?: any, password?: any, header?: string): void;
    getXML(): samchon.library.XML;
    protected callAPI(fields: any, url: string, temporaryFilePath?: any, timeout?: number): any;
    getError(responseBody: any): any;
    checkResponseBody(responseBody: any, url: string): any;
    pushDataSpecifications(ignoreDeltaException?: boolean): any;
    checkChanges(): void;
    publishChanges(): void;
    publishOwnerChanges(publish?: boolean): any;
    verifyCredentials(): any;
    alreadyExistingSourceId(sourceId: string, container: string): boolean;
    getUnusedSourceIdPostFix(sourceId: string, container: string): any;
    getSourceIdFromFileNameFromPath(filePath: string, container: string, maxLength?: number, withoutExtension?: boolean): any;
    getFileNameFromPath(filePath: string, withoutExtension?: boolean): any;
    getFiles(): any;
    createZip(temporaryFilePath?: any, name?: string, clearFiles?: boolean): any;
    pushData(temporaryFilePath?: any, timeout?: number, clearFiles?: boolean): any;
    getTaskExecuteUrl(taskName: string): string;
    publishChoices(isTest?: boolean, taskName?: string): void;
    prepareCorpusIndex(taskName?: string): void;
    prepareAutocompleteIndex(fields: any, taskName?: string): void;
    private file_get_contents;
    private file_exists;
}
