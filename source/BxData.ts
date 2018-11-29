import samchon = require("samchon");
var csv = require('csv-parser');
import fs = require('fs');
import { BxClient } from "./BxClient";
var zip = require('node-zip');
var tmp = require('tmp');
var request = require('request');

export class BxData {
    URL_VERIFY_CREDENTIALS = '/frontend/dbmind/en/dbmind/api/credentials/verify';
    URL_XML = '/frontend/dbmind/en/dbmind/api/data/source/update';
    URL_PUBLISH_CONFIGURATION_CHANGES = '/frontend/dbmind/en/dbmind/api/configuration/publish/owner';
    URL_ZIP = '/frontend/dbmind/en/dbmind/api/data/push';
    URL_EXECUTE_TASK = '/frontend/dbmind/en/dbmind/files/task/execute';

    private bxClient: BxClient;
    private languages: any = [];
    private isDev: boolean = false;
    private isDelta:  boolean = false;
    private sources: any = Array();
    private delimiter: string = ',';
    private sourceIdContainers: any = Array();
    private globalValidate = true
    private ftpSources: any = Array();
    private httpSources: any = Array();

    private host = 'http://di1.bx-cloud.com';
    private owner = 'bx_client_data_api';

    constructor(bxClient: BxClient, languages: any = Array(), isDev: boolean = false, isDelta: boolean = false) {
        this.bxClient = bxClient;
        this.languages = languages;
        this.isDev = isDev;
        this.isDelta = isDelta;
    }

    setLanguages(languages: string) {
        this.languages = languages;
    }

    getLanguages() {
        return this.languages;
    }

    setDelimiter(delimiter: string) {
        this.delimiter = delimiter;
    }

    addMainXmlItemFile(filePath: string, itemIdColumn: string, xPath: any = '', encoding: string = 'UTF-8', sourceId: string = 'item_vals', container: string = 'products', validate: boolean = true) {
        var sourceKey: any = this.addXMLItemFile(filePath, itemIdColumn, xPath, encoding, sourceId, container, validate);
        this.addSourceIdField(sourceKey, itemIdColumn, 'XML', null, validate);
        this.addSourceStringField(sourceKey, "bx_item_id", itemIdColumn, null, validate);
        return sourceKey;
    }
    addMainCSVItemFile(filePath: string, itemIdColumn: string, encoding: string = 'UTF-8', delimiter: string = ',', enclosure: any = "\"", escape: any = "\\\\", lineSeparator: any = "\\n", sourceId: any = 'item_vals', container: any = 'products', validate: any = true) {
        var sourceKey: any = this.addCSVItemFile(filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate);
        this.addSourceIdField(sourceKey, itemIdColumn, 'CSV', null, validate);
        this.addSourceStringField(sourceKey, "bx_item_id", itemIdColumn, null, validate);
        return sourceKey;
    }

    addMainCSVCustomerFile(filePath: string, itemIdColumn: string, encoding: string = 'UTF-8', delimiter: string = ',', enclosure: string = "\&", escape: string = "\\\\", lineSeparator: string = "\\n", sourceId: string = 'customers', container: string = 'customers', validate: boolean = true) {
        var sourceKey: any = this.addCSVItemFile(filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate);
        this.addSourceIdField(sourceKey, itemIdColumn, 'CSV', null, validate);
        this.addSourceStringField(sourceKey, "bx_customer_id", itemIdColumn, null, validate);
        return sourceKey;
    }

    addCSVItemFile(filePath: string, itemIdColumn: string, encoding: string = 'UTF-8', delimiter: string = ',', enclosure: string = "\&", escape: any = "\\\\", lineSeparator: any = "\\n", sourceId: any = null, container: string = 'products', validate: boolean = true, maxLength: number = 23) {
        var params: any = Array({ 'itemIdColumn': itemIdColumn, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
        if (sourceId == null) {
            sourceId = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
        }
        return this.addSourceFile(filePath, sourceId, container, 'item_data_file', 'CSV', params, validate);
    }

    addXMLItemFile(filePath: string, itemIdColumn: string, xPath: any, encoding: string = 'UTF-8', sourceId: any = null, container: string = 'products', validate: any = true, maxLength: any = 23) {
        var params: any = Array({ 'itemIdColumn': itemIdColumn, 'encoding': encoding, 'baseXPath': xPath });
        if (sourceId == null) {
            sourceId = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
        }
        return this.addSourceFile(filePath, sourceId, container, 'item_data_file', 'XML', params, validate);
    }
    addCSVCustomerFile(filePath: string, itemIdColumn: string, encoding: string = 'UTF-8', delimiter: string = ',', enclosure: string = "\&", escape: any = "\\\\", lineSeparator: any = "\\n", sourceId: any = null, container: string = 'customers', validate: boolean = true, maxLength: number = 23) {
        var params: any = Array({ 'itemIdColumn': itemIdColumn, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
        if (sourceId == null) {
            sourceId = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
        }
        return this.addSourceFile(filePath, sourceId, container, 'item_data_file', 'CSV', params, validate);
    }

    addCategoryFile(filePath: string, categoryIdColumn: string, parentIdColumn: string, categoryLabelColumns: any, encoding: string = 'UTF-8', delimiter: string = ',', enclosure: string = "\&", escape: string = "\\\\", lineSeparator: string = "\\n", sourceId: string = 'resource_categories', container: string = 'products', validate: boolean = true) {
        var params = Array({ 'referenceIdColumn': categoryIdColumn, 'parentIdColumn': parentIdColumn, 'labelColumns': categoryLabelColumns, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
        return this.addSourceFile(filePath, sourceId, container, 'hierarchical', 'CSV', params, validate);
    }

    addResourceFile(filePath: string, categoryIdColumn: string, labelColumns: any, encoding: any = 'UTF-8', delimiter: string = ',', enclosure: string = "\&", escape: string = "\\\\", lineSeparator: string = "\\n", sourceId: any = null, container: string = 'products', validate: boolean = true, maxLength: number = 23) {
        var params: any = Array({ 'referenceIdColumn': categoryIdColumn, 'labelColumns': labelColumns, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
        if (sourceId == null) {
            sourceId = 'resource_' + this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
        }
        return this.addSourceFile(filePath, sourceId, container, 'resource', 'CSV', params, validate);
    }

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
    addExtraTableToEntity(filePath: string, container: string, column: string, columns: string[], maxLength: number = 23) {
        var params: any = { 'referenceIdColumn': column, 'labelColumns': columns, 'encoding': 'UTF-8', 'delimiter': ',', 'enclosure': '"', 'escape': "\\\\", 'lineSeparator': "\\n" };
        var sourceId: any = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);

        return this.addSourceFile(filePath, sourceId, container, 'resource', 'CSV', params);
    }

    setCSVTransactionFile(filePath: string, orderIdColumn: string, productIdColumn: string, customerIdColumn: string, orderDateIdColumn: string, totalOrderValueColumn: string, productListPriceColumn: string, productDiscountedPriceColumn: string, productIdField: string = 'bx_item_id', customerIdField: string = 'bx_customer_id', productsContainer: string = 'products', customersContainer: string = 'customers', format: string = 'CSV', encoding: string = 'UTF-8', delimiter: string = ',', enclosure: string = '"', escape: string = "\\\\", lineSeparator: string = "\\n", container: string = 'transactions', sourceId: string = 'transactions', validate: boolean = true) {

        var params: any = Array({ 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });

        params['file'] = this.getFileNameFromPath(filePath);
        params['orderIdColumn'] = orderIdColumn;
        params['productIdColumn'] = productIdColumn;
        params['product_property_id'] = productIdField;
        params['customerIdColumn'] = customerIdColumn;
        params['customer_property_id'] = customerIdField;
        params['productListPriceColumn'] = productListPriceColumn;
        params['productDiscountedPriceColumn'] = productDiscountedPriceColumn;
        params['totalOrderValueColumn'] = totalOrderValueColumn;
        params['orderReceptionDateColumn'] = orderDateIdColumn;

        return this.addSourceFile(filePath, sourceId, container, 'transactions', format, params, validate);
    }

    addSourceFile(filePath: string, sourceId: string, container: string, type: string, format: string = 'CSV', params: any = Array(), validate: boolean = true) {
        var langSize: any = this.getLanguages();
        if (langSize.length == 0) {
            throw new Error("trying to add a source before having declared the languages with method setLanguages");
        }
        if (this.sources[container] === null) {
            this.sources[container] = Array();
        }
        params['filePath'] = filePath;
        params['format'] = format;
        params['type'] = type;
        this.sources[container][sourceId] = params;
        if (validate) {
            this.validateSource(container, sourceId);
        }
        this.sourceIdContainers[sourceId] = container;
        return this.encodesourceKey(container, sourceId);
    }

    decodeSourceKey(sourceKey: string) {
        return sourceKey.split('-');
    }

    encodesourceKey(container: string, sourceId: string) {
        return container + '-' + sourceId;
    }

    getSourceCSVRow(container: string, sourceId: string, row: number = 0, maxRow: number = 2) {
        if (this.sources[container][sourceId]['rows'] === null) {
            let data: any = Array();
            fs.createReadStream(this.sources[container][sourceId]['filePath'])
                .pipe(csv({
                    data: this.sources[container][sourceId]['filePath'],
                    separator: this.delimiter
                }))
                .on('data', data.push)
                .on('end', () => {
                    for (let count = 0; count < data.length; count++) {
                        this.sources[container][sourceId]['rows'].push(data);
                        if (count >= maxRow) {
                            break;
                        }
                    }
                });
        }
        if ((typeof (this.sources[container][sourceId]['rows'][row]) != "undefined" && this.sources[container][sourceId]['rows'][row] !== null)) {
            return this.sources[container][sourceId]['rows'][row];
        }
        return null;
    }

    setGlobalValidate(globalValidate: boolean) {
        this.globalValidate = globalValidate;
    }

    validateSource(container: string, sourceId: string) {
        if (!this.globalValidate) {
            return;
        }
        var source: any = this.sources[container][sourceId];
        if (source['format'] == 'CSV') {
            if (typeof (source['itemIdColumn']) != "undefined" && source['itemIdColumn'] !== null) {
                this.validateColumnExistance(container, sourceId, source['itemIdColumn']);
            }
        }
    }

    validateColumnExistance(container: string, sourceId: string, col: string) {
        if (!this.globalValidate) {
            return;
        }
        var row: any = this.getSourceCSVRow(container, sourceId, 0);
        if (row !== null && row.indexOf(col) > -1) {
            throw new Error("the source 'sourceId' in the container 'container' declares an column 'col' which is not present in the header row of the provided CSV file: " + row.join(','));
        }
    }

    addSourceIdField(sourceKey: string, col: string, format: string, referenceSourceKey: any = null, validate: boolean = true) {
        var id_field: any = format == 'CSV' ? 'bx_id' : 'id';
        this.addSourceField(sourceKey, id_field, "id", false, col, referenceSourceKey, validate);
    }

    addSourceTitleField(sourceKey: string, colMap: string, referenceSourceKey: any = null, validate: boolean = true) {
        this.addSourceField(sourceKey, "bx_title", "title", true, colMap, referenceSourceKey, validate);
    }

    addSourceDescriptionField(sourceKey: string, colMap: string, referenceSourceKey: any = null, validate: boolean = true) {
        this.addSourceField(sourceKey, "bx_description", "body", true, colMap, referenceSourceKey, validate);
    }

    addSourceListPriceField(sourceKey: string, col: string, referenceSourceKey: any = null, validate: boolean = true) {
        this.addSourceField(sourceKey, "bx_listprice", "price", false, col, referenceSourceKey, validate);
    }

    addSourceDiscountedPriceField(sourceKey: string, col: string, referenceSourceKey: any = null, validate: boolean = true) {
        this.addSourceField(sourceKey, "bx_discountedprice", "discounted", false, col, referenceSourceKey, validate);
    }

    addSourceLocalizedTextField(sourceKey: string, fieldName: string, colMap: string, referenceSourceKey: any = null, validate: boolean = true) {
        this.addSourceField(sourceKey, fieldName, "text", true, colMap, referenceSourceKey, validate);
    }

    addSourceStringField(sourceKey: string, fieldName: string, col: string, referenceSourceKey: any = null, validate: boolean = true) {
        this.addSourceField(sourceKey, fieldName, "string", false, col, referenceSourceKey, validate);
    }

    addSourceNumberField(sourceKey: string, fieldName: string, col: string, referenceSourceKey: any = null, validate: boolean = true) {
        this.addSourceField(sourceKey, fieldName, "number", false, col, referenceSourceKey, validate);
    }

    setCategoryField(sourceKey: string, col: string, referenceSourceKey: any = "resource_categories", validate: boolean = true) {
        if (referenceSourceKey == "resource_categories") {
            var decodeKey = this.decodeSourceKey(sourceKey);
            var container: any = decodeKey[0];
            referenceSourceKey = this.encodesourceKey(container, referenceSourceKey);
        }
        this.addSourceField(sourceKey, "category", "hierarchical", false, col, referenceSourceKey, validate);
    }

    addSourceField(sourceKey: string, fieldName: string, type: string, localized: boolean, colMap: string, referenceSourceKey: any = null, validate: boolean = true) {
        var decodeKey = this.decodeSourceKey(sourceKey);
        var container: any = decodeKey[0];
        var sourceId: any = decodeKey[1];
        if (this.sources[container][sourceId]['fields'] === null) {
            this.sources[container][sourceId]['fields'] = Array();
        }
        this.sources[container][sourceId]['fields'][fieldName] = Array({ 'type': type, 'localized': localized, 'map': colMap, 'referenceSourceKey': referenceSourceKey });
        if (this.sources[container][sourceId]['format'] == 'CSV') {
            if (localized && referenceSourceKey == null) {
                if (!Array.isArray(colMap)) {
                    throw new Error("'fieldName': invalid column field name for a localized field (expect an Array with a column name for each language Array(lang:colName)): " + JSON.stringify(colMap));
                }
                var langVals = this.getLanguages();
                langVals.forEach(function (lang: any) {
                    if (colMap[lang] === null) {
                        throw new Error("'fieldName': no language column provided for language 'lang' in provided column map): " + JSON.stringify(colMap));
                    }
                    if (typeof colMap[lang] === "string") {
                        throw new Error("'fieldName': invalid column field name for a non-localized field (expect a string): " + JSON.stringify(colMap));
                    }
                    if (validate) {
                        this.validateColumnExistance(container, sourceId, colMap[lang]);
                    }
                });
            } else {
                if (typeof colMap === "string") {
                    throw new Error("'fieldName' invalid column field name for a non-localized field (expect a string): " + JSON.stringify(colMap));
                }
                if (validate) {
                    this.validateColumnExistance(container, sourceId, colMap);
                }
            }
        }
    }

    setFieldIsMultiValued(sourceKey: string, fieldName: string, multiValued: boolean = true) {
        this.addFieldParameter(sourceKey, fieldName, 'multiValued', multiValued ? 'true' : 'false');
    }

    addSourceCustomerGuestProperty(sourceKey: string, parameterValue: string) {
        this.addSourceParameter(sourceKey, "guest_property_id", parameterValue);
    }

    addSourceParameter(sourceKey: string, parameterName: string, parameterValue: string) {
        var decodeKey = this.decodeSourceKey(sourceKey);
        var container: any = decodeKey[0];
        var sourceId: any = decodeKey[1];
        if (this.sources[container][sourceId] === null) {
            throw new Error("trying to add a source parameter on sourceId 'sourceId', container 'container' while this source doesn't exist");
        }
        this.sources[container][sourceId][parameterName] = parameterValue;
    }

    addFieldParameter(sourceKey: string, fieldName: string, parameterName: string, parameterValue: string) {
        var decodeKey = this.decodeSourceKey(sourceKey);
        var container: string = decodeKey[0];
        var sourceId: string = decodeKey[1];
        if (this.sources[container][sourceId]['fields'][fieldName] === null) {
            throw new Error("trying to add a field parameter on sourceId 'sourceId', container 'container', fieldName 'fieldName' while this field doesn't exist");
        }
        if (this.sources[container][sourceId]['fields'][fieldName]['fieldParameters'] === null) {
            this.sources[container][sourceId]['fields'][fieldName]['fieldParameters'] = Array();
        }
        this.sources[container][sourceId]['fields'][fieldName]['fieldParameters'][parameterName] = parameterValue;
    }

    setFtpSource(sourceKey: string, host: string = "di1.bx-cloud.com", port: number = 21, user: any = null, password: any = null, remoteDir: any = '/sources/production', protocol: number = 0, type: number = 0, logontype: number = 1,
        timezoneoffset = 0, pasvMode = 'MODE_DEFAULT', maximumMultipeConnections = 0, encodingType = 'Auto', bypassProxy = 0, syncBrowsing = 0) {

        if (user == null) {
            user = this.bxClient.getAccount(false);
        }

        if (password == null) {
            password = this.bxClient.getPassword();
        }

        var params: any = Array();
        params['Host'] = host;
        params['Port'] = port;
        params['User'] = user;
        params['Pass'] = password;
        params['Protocol'] = protocol;
        params['Type'] = type;
        params['Logontype'] = logontype;
        params['TimezoneOffset'] = timezoneoffset;
        params['PasvMode'] = pasvMode;
        params['MaximumMultipleConnections'] = maximumMultipeConnections;
        params['EncodingType'] = encodingType;
        params['BypassProxy'] = bypassProxy;
        params['Name'] = user + " at " + host;
        params['RemoteDir'] = remoteDir;
        params['SyncBrowsing'] = syncBrowsing;

        var decodeKey = this.decodeSourceKey(sourceKey);
        var container: any = decodeKey[0];
        var sourceId: any = decodeKey[1];

        this.ftpSources[sourceId] = params;
    }

    setHttpSource(sourceKey: string, webDirectory: string, user: any = null, password: any = null, header: string = 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0') {

        if (user === null) {
            user = this.bxClient.getAccount(false);
        }

        if (password === null) {
            password = this.bxClient.getPassword();
        }

        var params: any = Array();
        params['WebDirectory'] = webDirectory;
        params['User'] = user;
        params['Pass'] = password;
        params['Header'] = header;

        var decodeKey = this.decodeSourceKey(sourceKey);
        var container: any = decodeKey[0];
        var sourceId: any = decodeKey[1];

        this.httpSources[sourceId] = params;
    }

    getXML() {
        let xml: samchon.library.XML = new samchon.library.XML();
        xml.setTag("languages");
        this.getLanguages().forEach(function (lang: any) {
            xml.setTag("language");
            xml.setProperty('id', lang);
        });

        // CREATE containers_List TEMPORAILY
        let containersList: samchon.library.XML = new samchon.library.XML();
        containersList.setTag("containers");

        // INSERT containers_List TO THE TOP LEVEL'S
        xml.push(containersList);

        //containers
        var containers: any = xml.setTag('containers');
        for (var containerName in this.sources) {
            var containerSources = this.sources[containerName];
            var container: any = containers.setTag('container');
            container.setProperty('id', containerName);
            container.setProperty('type', containerName);

            var sources: any = container.setTag('sources');
            var properties: any = container.setTag('properties');
        }
        return xml;
    }

    protected callAPI(fields: any, url: string, temporaryFilePath: any = null, timeout: number = 60) {
        let responseBody: any;
        request.post({
            url: url,
            form: { fields }
        }, function (err: any, httpResponse: any, body: any) {
            responseBody = body
        });
        return this.checkResponseBody(responseBody, url);
    }

    getError(responseBody: any) {
        return responseBody;
    }

    checkResponseBody(responseBody: any, url: string) {
        if (responseBody == null) {
            throw new Error("API response of call to url is empty string, this is an error!");
        }
        let value: any = JSON.parse(responseBody);
        if (value.length != 1 || value['token'] === null) {
            if (value['changes'] === "undefined" || value['changes'] === "null") {
                throw new Error(responseBody);
            }
        }
        return value;
    }

    pushDataSpecifications(ignoreDeltaException = false) {

        if (!ignoreDeltaException && this.isDelta) {
            throw new Error("You should not push specifications when you are pushing a delta file. Only do it when you are preparing full files. Set method parameter ignoreDeltaException to true to ignore this exception and publish anyway.");
        }

        let fields: any = Array({
            'username': this.bxClient.getUsername(),
            'password': this.bxClient.getPassword(),
            'account': this.bxClient.getAccount(false),
            'owner': this.owner,
            'xml': this.getXML()
        });

        let url = this.host + this.URL_XML;
        return this.callAPI(fields, url);
    }

    checkChanges() {
        this.publishOwnerChanges(false);
    }

    publishChanges() {
        this.publishOwnerChanges(true);
    }

    publishOwnerChanges(publish = true) {
        if (this.isDev) {
            publish = false;
        }
        let fields: any = Array({
            'username': this.bxClient.getUsername(),
            'password': this.bxClient.getPassword(),
            'account': this.bxClient.getAccount(false),
            'owner': this.owner,
            'publish': (publish ? 'true' : 'false')
        });

        let url: any = this.host + this.URL_PUBLISH_CONFIGURATION_CHANGES;
        return this.callAPI(fields, url);
    }

    verifyCredentials() {
        let fields: any = Array({
            'username': this.bxClient.getUsername(),
            'password': this.bxClient.getPassword(),
            'account': this.bxClient.getAccount(false),
            'owner': this.owner
        });

        let url: any = this.host + this.URL_VERIFY_CREDENTIALS;
        return this.callAPI(fields, url);
    }

    alreadyExistingSourceId(sourceId: string, container: string) {
        return (typeof (this.sources[container][sourceId]) != "undefined" && this.sources[container][sourceId] !== null);
    }

    getUnusedSourceIdPostFix(sourceId: string, container: string) {
        let postFix: any = 2;
        let sorcContainer: any = this.sources[container];
        sorcContainer.forEach(function (sid: any) {
            let values: any = sorcContainer[sid];
            if (sid.indexOf(sourceId) === 0) {
                let count: any = sid.replace(sourceId, '');
                if (count >= postFix) {
                    postFix = count + 1;
                }
            }
        });
        return postFix;
    }

    getSourceIdFromFileNameFromPath(filePath: string, container: string, maxLength: number = 23, withoutExtension: boolean = false) {
        let sourceId: any = this.getFileNameFromPath(filePath, withoutExtension);
        let shortened: any = false;
        if (sourceId.length > maxLength) {
            sourceId = sourceId.substring(0, maxLength);
            shortened = true;
        }
        if (this.alreadyExistingSourceId(sourceId, container)) {
            if (!shortened) {
                throw new Error('Synchronization failure: Same source id requested twice "' + filePath + '". Please correct that only created once.');
            }
            let postFix: any = this.getUnusedSourceIdPostFix(sourceId, container);
            sourceId = sourceId + postFix;
        }
        return sourceId;
    }

    getFileNameFromPath(filePath: string, withoutExtension: boolean = false) {
        let parts: any = filePath.split('/');
        let file: any = parts[parts.length - 1];
        if (withoutExtension) {
            parts = file.split('.');
            return parts[0];
        }
        return file;
    }

    getFiles() {
        let files: any = Array();
        for (let container in this.sources) {
            let containerSources: any = this.sources[container];
            for (let sourceId in containerSources) {
                let sourceValues: any = containerSources[sourceId];
                if (typeof (this.ftpSources[sourceId]) != "undefined" && this.ftpSources[sourceId] !== null) {
                    continue;
                }
                if (typeof (this.httpSources[sourceId]) != "undefined" && this.httpSources[sourceId] !== null) {
                    continue;
                }
                if (sourceValues['file'] === null) {
                    sourceValues['file'] = this.getFileNameFromPath(sourceValues['filePath']);
                }
                files[sourceValues['file']] = sourceValues['filePath'];
            }
        }
        return files;
    }

    createZip(temporaryFilePath: any = null, name: string = 'bxdata.zip', clearFiles: boolean = true) {
        if (temporaryFilePath === null) {
            temporaryFilePath = tmp.dirSync() + '/bxclient';
        }

        if (temporaryFilePath != "" && !this.file_exists(temporaryFilePath)) {
            fs.mkdirSync(temporaryFilePath);
        }

        let zipFilePath: any = temporaryFilePath + '/' + name;

        if (this.file_exists(zipFilePath)) {
            fs.unlinkSync(zipFilePath);
        }

        let files: any = this.getFiles();

        for (let f in files) {
            let filePath: any = files[f];
            zip.file(filePath, ('sample_data').concat(f));
        }
        var data = zip.generate({ base64: false, compression: 'DEFLATE' });
        fs.writeFileSync('test.zip', data, 'binary');

        return zipFilePath;
    }

    pushData(temporaryFilePath: any = null, timeout: number = 60, clearFiles: boolean = true) {

        var zipFile = this.createZip(temporaryFilePath, 'bxdata.zip', clearFiles);

        var fields: any = Array({
            'username': this.bxClient.getUsername(),
            'password': this.bxClient.getPassword(),
            'account': this.bxClient.getAccount(false),
            'owner': this.owner,
            'dev': (this.isDev ? 'true' : 'false'),
            'delta': (this.isDelta ? 'true' : 'false'),
            'data': zipFile + "type=application/zip"
            //'data': this.getCurlFile(zipFile, "application/zip")
        });
        let url: any = this.host + this.URL_ZIP
        return this.callAPI(fields, url, temporaryFilePath, timeout);
    }
    
    getTaskExecuteUrl(taskName: string) {
        return this.host + this.URL_EXECUTE_TASK + '?iframeAccount=' + this.bxClient.getAccount() + '&task_process=' + taskName;
    }

    publishChoices(isTest: boolean = false, taskName: string = "generate_optimization") {

        if (this.isDev) {
            taskName = taskName + '_dev';
        }
        if (isTest) {
            taskName = taskName + '_test';
        }
        let url: any = this.getTaskExecuteUrl(taskName);
        this.file_get_contents(url);
    }

    prepareCorpusIndex(taskName: string = "corpus") {
        let url: any = this.getTaskExecuteUrl(taskName);
        this.file_get_contents(url);
    }

    prepareAutocompleteIndex(fields: any, taskName: string = "autocomplete") {
        let url: any = this.getTaskExecuteUrl(taskName);
        this.file_get_contents(url);
    }

    private file_get_contents(url: string) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "url", true);
        xhr.onload = function () {
            console.log(xhr.responseText);
        };
        xhr.send();
    }

    private file_exists(file: any) {
        let isexists = false;
        fs.exists(file, (exist) => {
            if (exist) {
                isexists = true;
            } else {
                isexists = false;
            }
        });
        return isexists;
    }
}
