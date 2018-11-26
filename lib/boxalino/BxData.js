(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "samchon", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var samchon = require("samchon");
    var csv = require('csv-parser');
    var fs = require("fs");
    var zip = require('node-zip');
    var tmp = require('tmp');
    var request = require('request');
    var BxData = /** @class */ (function () {
        function BxData(bxClient, languages, isDev, isDelta) {
            if (languages === void 0) { languages = Array(); }
            if (isDev === void 0) { isDev = false; }
            if (isDelta === void 0) { isDelta = false; }
            this.URL_VERIFY_CREDENTIALS = '/frontend/dbmind/en/dbmind/api/credentials/verify';
            this.URL_XML = '/frontend/dbmind/en/dbmind/api/data/source/update';
            this.URL_PUBLISH_CONFIGURATION_CHANGES = '/frontend/dbmind/en/dbmind/api/configuration/publish/owner';
            this.URL_ZIP = '/frontend/dbmind/en/dbmind/api/data/push';
            this.URL_EXECUTE_TASK = '/frontend/dbmind/en/dbmind/files/task/execute';
            this.languages = [];
            this.isDev = false;
            this.isDelta = false;
            this.sources = Array();
            this.delimiter = ',';
            this.sourceIdContainers = Array();
            this.globalValidate = true;
            this.ftpSources = Array();
            this.httpSources = Array();
            this.host = 'http://di1.bx-cloud.com';
            this.owner = 'bx_client_data_api';
            this.bxClient = bxClient;
            this.languages = languages;
            this.isDev = isDev;
            this.isDelta = isDelta;
        }
        BxData.prototype.setLanguages = function (languages) {
            this.languages = languages;
        };
        BxData.prototype.getLanguages = function () {
            return this.languages;
        };
        BxData.prototype.setDelimiter = function (delimiter) {
            this.delimiter = delimiter;
        };
        BxData.prototype.addMainXmlItemFile = function (filePath, itemIdColumn, xPath, encoding, sourceId, container, validate) {
            if (xPath === void 0) { xPath = ''; }
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (sourceId === void 0) { sourceId = 'item_vals'; }
            if (container === void 0) { container = 'products'; }
            if (validate === void 0) { validate = true; }
            var sourceKey = this.addXMLItemFile(filePath, itemIdColumn, xPath, encoding, sourceId, container, validate);
            this.addSourceIdField(sourceKey, itemIdColumn, 'XML', null, validate);
            this.addSourceStringField(sourceKey, "bx_item_id", itemIdColumn, null, validate);
            return sourceKey;
        };
        BxData.prototype.addMainCSVItemFile = function (filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate) {
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (delimiter === void 0) { delimiter = ','; }
            if (enclosure === void 0) { enclosure = "\""; }
            if (escape === void 0) { escape = "\\\\"; }
            if (lineSeparator === void 0) { lineSeparator = "\\n"; }
            if (sourceId === void 0) { sourceId = 'item_vals'; }
            if (container === void 0) { container = 'products'; }
            if (validate === void 0) { validate = true; }
            var sourceKey = this.addCSVItemFile(filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate);
            this.addSourceIdField(sourceKey, itemIdColumn, 'CSV', null, validate);
            this.addSourceStringField(sourceKey, "bx_item_id", itemIdColumn, null, validate);
            return sourceKey;
        };
        BxData.prototype.addMainCSVCustomerFile = function (filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate) {
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (delimiter === void 0) { delimiter = ','; }
            if (enclosure === void 0) { enclosure = "\&"; }
            if (escape === void 0) { escape = "\\\\"; }
            if (lineSeparator === void 0) { lineSeparator = "\\n"; }
            if (sourceId === void 0) { sourceId = 'customers'; }
            if (container === void 0) { container = 'customers'; }
            if (validate === void 0) { validate = true; }
            var sourceKey = this.addCSVItemFile(filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate);
            this.addSourceIdField(sourceKey, itemIdColumn, 'CSV', null, validate);
            this.addSourceStringField(sourceKey, "bx_customer_id", itemIdColumn, null, validate);
            return sourceKey;
        };
        BxData.prototype.addCSVItemFile = function (filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate, maxLength) {
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (delimiter === void 0) { delimiter = ','; }
            if (enclosure === void 0) { enclosure = "\&"; }
            if (escape === void 0) { escape = "\\\\"; }
            if (lineSeparator === void 0) { lineSeparator = "\\n"; }
            if (sourceId === void 0) { sourceId = null; }
            if (container === void 0) { container = 'products'; }
            if (validate === void 0) { validate = true; }
            if (maxLength === void 0) { maxLength = 23; }
            var params = Array({ 'itemIdColumn': itemIdColumn, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
            if (sourceId == null) {
                sourceId = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
            }
            return this.addSourceFile(filePath, sourceId, container, 'item_data_file', 'CSV', params, validate);
        };
        BxData.prototype.addXMLItemFile = function (filePath, itemIdColumn, xPath, encoding, sourceId, container, validate, maxLength) {
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (sourceId === void 0) { sourceId = null; }
            if (container === void 0) { container = 'products'; }
            if (validate === void 0) { validate = true; }
            if (maxLength === void 0) { maxLength = 23; }
            var params = Array({ 'itemIdColumn': itemIdColumn, 'encoding': encoding, 'baseXPath': xPath });
            if (sourceId == null) {
                sourceId = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
            }
            return this.addSourceFile(filePath, sourceId, container, 'item_data_file', 'XML', params, validate);
        };
        BxData.prototype.addCSVCustomerFile = function (filePath, itemIdColumn, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate, maxLength) {
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (delimiter === void 0) { delimiter = ','; }
            if (enclosure === void 0) { enclosure = "\&"; }
            if (escape === void 0) { escape = "\\\\"; }
            if (lineSeparator === void 0) { lineSeparator = "\\n"; }
            if (sourceId === void 0) { sourceId = null; }
            if (container === void 0) { container = 'customers'; }
            if (validate === void 0) { validate = true; }
            if (maxLength === void 0) { maxLength = 23; }
            var params = Array({ 'itemIdColumn': itemIdColumn, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
            if (sourceId == null) {
                sourceId = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
            }
            return this.addSourceFile(filePath, sourceId, container, 'item_data_file', 'CSV', params, validate);
        };
        BxData.prototype.addCategoryFile = function (filePath, categoryIdColumn, parentIdColumn, categoryLabelColumns, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate) {
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (delimiter === void 0) { delimiter = ','; }
            if (enclosure === void 0) { enclosure = "\&"; }
            if (escape === void 0) { escape = "\\\\"; }
            if (lineSeparator === void 0) { lineSeparator = "\\n"; }
            if (sourceId === void 0) { sourceId = 'resource_categories'; }
            if (container === void 0) { container = 'products'; }
            if (validate === void 0) { validate = true; }
            var params = Array({ 'referenceIdColumn': categoryIdColumn, 'parentIdColumn': parentIdColumn, 'labelColumns': categoryLabelColumns, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
            return this.addSourceFile(filePath, sourceId, container, 'hierarchical', 'CSV', params, validate);
        };
        BxData.prototype.addResourceFile = function (filePath, categoryIdColumn, labelColumns, encoding, delimiter, enclosure, escape, lineSeparator, sourceId, container, validate, maxLength) {
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (delimiter === void 0) { delimiter = ','; }
            if (enclosure === void 0) { enclosure = "\&"; }
            if (escape === void 0) { escape = "\\\\"; }
            if (lineSeparator === void 0) { lineSeparator = "\\n"; }
            if (sourceId === void 0) { sourceId = null; }
            if (container === void 0) { container = 'products'; }
            if (validate === void 0) { validate = true; }
            if (maxLength === void 0) { maxLength = 23; }
            var params = Array({ 'referenceIdColumn': categoryIdColumn, 'labelColumns': labelColumns, 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
            if (sourceId == null) {
                sourceId = 'resource_' + this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
            }
            return this.addSourceFile(filePath, sourceId, container, 'resource', 'CSV', params, validate);
        };
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
        BxData.prototype.addExtraTableToEntity = function (filePath, container, column, columns, maxLength) {
            if (maxLength === void 0) { maxLength = 23; }
            var params = { 'referenceIdColumn': column, 'labelColumns': columns, 'encoding': 'UTF-8', 'delimiter': ',', 'enclosure': '"', 'escape': "\\\\", 'lineSeparator': "\\n" };
            var sourceId = this.getSourceIdFromFileNameFromPath(filePath, container, maxLength, true);
            return this.addSourceFile(filePath, sourceId, container, 'resource', 'CSV', params);
        };
        BxData.prototype.setCSVTransactionFile = function (filePath, orderIdColumn, productIdColumn, customerIdColumn, orderDateIdColumn, totalOrderValueColumn, productListPriceColumn, productDiscountedPriceColumn, productIdField, customerIdField, productsContainer, customersContainer, format, encoding, delimiter, enclosure, escape, lineSeparator, container, sourceId, validate) {
            if (productIdField === void 0) { productIdField = 'bx_item_id'; }
            if (customerIdField === void 0) { customerIdField = 'bx_customer_id'; }
            if (productsContainer === void 0) { productsContainer = 'products'; }
            if (customersContainer === void 0) { customersContainer = 'customers'; }
            if (format === void 0) { format = 'CSV'; }
            if (encoding === void 0) { encoding = 'UTF-8'; }
            if (delimiter === void 0) { delimiter = ','; }
            if (enclosure === void 0) { enclosure = '"'; }
            if (escape === void 0) { escape = "\\\\"; }
            if (lineSeparator === void 0) { lineSeparator = "\\n"; }
            if (container === void 0) { container = 'transactions'; }
            if (sourceId === void 0) { sourceId = 'transactions'; }
            if (validate === void 0) { validate = true; }
            var params = Array({ 'encoding': encoding, 'delimiter': delimiter, 'enclosure': enclosure, 'escape': escape, 'lineSeparator': lineSeparator });
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
        };
        BxData.prototype.addSourceFile = function (filePath, sourceId, container, type, format, params, validate) {
            if (format === void 0) { format = 'CSV'; }
            if (params === void 0) { params = Array(); }
            if (validate === void 0) { validate = true; }
            var langSize = this.getLanguages();
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
        };
        BxData.prototype.decodeSourceKey = function (sourceKey) {
            return sourceKey.split('-');
        };
        BxData.prototype.encodesourceKey = function (container, sourceId) {
            return container + '-' + sourceId;
        };
        BxData.prototype.getSourceCSVRow = function (container, sourceId, row, maxRow) {
            var _this = this;
            if (row === void 0) { row = 0; }
            if (maxRow === void 0) { maxRow = 2; }
            if (this.sources[container][sourceId]['rows'] === null) {
                var data_1 = Array();
                fs.createReadStream(this.sources[container][sourceId]['filePath'])
                    .pipe(csv({
                    data: this.sources[container][sourceId]['filePath'],
                    separator: this.delimiter
                }))
                    .on('data', data_1.push)
                    .on('end', function () {
                    for (var count = 0; count < data_1.length; count++) {
                        _this.sources[container][sourceId]['rows'].push(data_1);
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
        };
        BxData.prototype.setGlobalValidate = function (globalValidate) {
            this.globalValidate = globalValidate;
        };
        BxData.prototype.validateSource = function (container, sourceId) {
            if (!this.globalValidate) {
                return;
            }
            var source = this.sources[container][sourceId];
            if (source['format'] == 'CSV') {
                if (typeof (source['itemIdColumn']) != "undefined" && source['itemIdColumn'] !== null) {
                    this.validateColumnExistance(container, sourceId, source['itemIdColumn']);
                }
            }
        };
        BxData.prototype.validateColumnExistance = function (container, sourceId, col) {
            if (!this.globalValidate) {
                return;
            }
            var row = this.getSourceCSVRow(container, sourceId, 0);
            if (row !== null && row.indexOf(col) > -1) {
                throw new Error("the source 'sourceId' in the container 'container' declares an column 'col' which is not present in the header row of the provided CSV file: " + row.join(','));
            }
        };
        BxData.prototype.addSourceIdField = function (sourceKey, col, format, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            var id_field = format == 'CSV' ? 'bx_id' : 'id';
            this.addSourceField(sourceKey, id_field, "id", false, col, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceTitleField = function (sourceKey, colMap, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            this.addSourceField(sourceKey, "bx_title", "title", true, colMap, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceDescriptionField = function (sourceKey, colMap, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            this.addSourceField(sourceKey, "bx_description", "body", true, colMap, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceListPriceField = function (sourceKey, col, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            this.addSourceField(sourceKey, "bx_listprice", "price", false, col, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceDiscountedPriceField = function (sourceKey, col, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            this.addSourceField(sourceKey, "bx_discountedprice", "discounted", false, col, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceLocalizedTextField = function (sourceKey, fieldName, colMap, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            this.addSourceField(sourceKey, fieldName, "text", true, colMap, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceStringField = function (sourceKey, fieldName, col, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            this.addSourceField(sourceKey, fieldName, "string", false, col, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceNumberField = function (sourceKey, fieldName, col, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            this.addSourceField(sourceKey, fieldName, "number", false, col, referenceSourceKey, validate);
        };
        BxData.prototype.setCategoryField = function (sourceKey, col, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = "resource_categories"; }
            if (validate === void 0) { validate = true; }
            if (referenceSourceKey == "resource_categories") {
                var decodeKey = this.decodeSourceKey(sourceKey);
                var container = decodeKey[0];
                referenceSourceKey = this.encodesourceKey(container, referenceSourceKey);
            }
            this.addSourceField(sourceKey, "category", "hierarchical", false, col, referenceSourceKey, validate);
        };
        BxData.prototype.addSourceField = function (sourceKey, fieldName, type, localized, colMap, referenceSourceKey, validate) {
            if (referenceSourceKey === void 0) { referenceSourceKey = null; }
            if (validate === void 0) { validate = true; }
            var decodeKey = this.decodeSourceKey(sourceKey);
            var container = decodeKey[0];
            var sourceId = decodeKey[1];
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
                    langVals.forEach(function (lang) {
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
                }
                else {
                    if (typeof colMap === "string") {
                        throw new Error("'fieldName' invalid column field name for a non-localized field (expect a string): " + JSON.stringify(colMap));
                    }
                    if (validate) {
                        this.validateColumnExistance(container, sourceId, colMap);
                    }
                }
            }
        };
        BxData.prototype.setFieldIsMultiValued = function (sourceKey, fieldName, multiValued) {
            if (multiValued === void 0) { multiValued = true; }
            this.addFieldParameter(sourceKey, fieldName, 'multiValued', multiValued ? 'true' : 'false');
        };
        BxData.prototype.addSourceCustomerGuestProperty = function (sourceKey, parameterValue) {
            this.addSourceParameter(sourceKey, "guest_property_id", parameterValue);
        };
        BxData.prototype.addSourceParameter = function (sourceKey, parameterName, parameterValue) {
            var decodeKey = this.decodeSourceKey(sourceKey);
            var container = decodeKey[0];
            var sourceId = decodeKey[1];
            if (this.sources[container][sourceId] === null) {
                throw new Error("trying to add a source parameter on sourceId 'sourceId', container 'container' while this source doesn't exist");
            }
            this.sources[container][sourceId][parameterName] = parameterValue;
        };
        BxData.prototype.addFieldParameter = function (sourceKey, fieldName, parameterName, parameterValue) {
            var decodeKey = this.decodeSourceKey(sourceKey);
            var container = decodeKey[0];
            var sourceId = decodeKey[1];
            if (this.sources[container][sourceId]['fields'][fieldName] === null) {
                throw new Error("trying to add a field parameter on sourceId 'sourceId', container 'container', fieldName 'fieldName' while this field doesn't exist");
            }
            if (this.sources[container][sourceId]['fields'][fieldName]['fieldParameters'] === null) {
                this.sources[container][sourceId]['fields'][fieldName]['fieldParameters'] = Array();
            }
            this.sources[container][sourceId]['fields'][fieldName]['fieldParameters'][parameterName] = parameterValue;
        };
        BxData.prototype.setFtpSource = function (sourceKey, host, port, user, password, remoteDir, protocol, type, logontype, timezoneoffset, pasvMode, maximumMultipeConnections, encodingType, bypassProxy, syncBrowsing) {
            if (host === void 0) { host = "di1.bx-cloud.com"; }
            if (port === void 0) { port = 21; }
            if (user === void 0) { user = null; }
            if (password === void 0) { password = null; }
            if (remoteDir === void 0) { remoteDir = '/sources/production'; }
            if (protocol === void 0) { protocol = 0; }
            if (type === void 0) { type = 0; }
            if (logontype === void 0) { logontype = 1; }
            if (timezoneoffset === void 0) { timezoneoffset = 0; }
            if (pasvMode === void 0) { pasvMode = 'MODE_DEFAULT'; }
            if (maximumMultipeConnections === void 0) { maximumMultipeConnections = 0; }
            if (encodingType === void 0) { encodingType = 'Auto'; }
            if (bypassProxy === void 0) { bypassProxy = 0; }
            if (syncBrowsing === void 0) { syncBrowsing = 0; }
            if (user == null) {
                user = this.bxClient.getAccount(false);
            }
            if (password == null) {
                password = this.bxClient.getPassword();
            }
            var params = Array();
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
            var container = decodeKey[0];
            var sourceId = decodeKey[1];
            this.ftpSources[sourceId] = params;
        };
        BxData.prototype.setHttpSource = function (sourceKey, webDirectory, user, password, header) {
            if (user === void 0) { user = null; }
            if (password === void 0) { password = null; }
            if (header === void 0) { header = 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0'; }
            if (user === null) {
                user = this.bxClient.getAccount(false);
            }
            if (password === null) {
                password = this.bxClient.getPassword();
            }
            var params = Array();
            params['WebDirectory'] = webDirectory;
            params['User'] = user;
            params['Pass'] = password;
            params['Header'] = header;
            var decodeKey = this.decodeSourceKey(sourceKey);
            var container = decodeKey[0];
            var sourceId = decodeKey[1];
            this.httpSources[sourceId] = params;
        };
        BxData.prototype.getXML = function () {
            var xml = new samchon.library.XML();
            xml.setTag("languages");
            this.getLanguages().forEach(function (lang) {
                xml.setTag("language");
                xml.setProperty('id', lang);
            });
            // CREATE containers_List TEMPORAILY
            var containersList = new samchon.library.XML();
            containersList.setTag("containers");
            // INSERT containers_List TO THE TOP LEVEL'S
            xml.push(containersList);
            //containers
            var containers = xml.setTag('containers');
            for (var containerName in this.sources) {
                var containerSources = this.sources[containerName];
                var container = containers.setTag('container');
                container.setProperty('id', containerName);
                container.setProperty('type', containerName);
                var sources = container.setTag('sources');
                var properties = container.setTag('properties');
            }
            return xml;
        };
        BxData.prototype.callAPI = function (fields, url, temporaryFilePath, timeout) {
            if (temporaryFilePath === void 0) { temporaryFilePath = null; }
            if (timeout === void 0) { timeout = 60; }
            var responseBody;
            request.post({
                url: url,
                form: { fields: fields }
            }, function (err, httpResponse, body) {
                responseBody = body;
            });
            return this.checkResponseBody(responseBody, url);
        };
        BxData.prototype.getError = function (responseBody) {
            return responseBody;
        };
        BxData.prototype.checkResponseBody = function (responseBody, url) {
            if (responseBody == null) {
                throw new Error("API response of call to url is empty string, this is an error!");
            }
            var value = JSON.parse(responseBody);
            if (value.length != 1 || value['token'] === null) {
                if (value['changes'] === "undefined" || value['changes'] === "null") {
                    throw new Error(responseBody);
                }
            }
            return value;
        };
        BxData.prototype.pushDataSpecifications = function (ignoreDeltaException) {
            if (ignoreDeltaException === void 0) { ignoreDeltaException = false; }
            if (!ignoreDeltaException && this.isDelta) {
                throw new Error("You should not push specifications when you are pushing a delta file. Only do it when you are preparing full files. Set method parameter ignoreDeltaException to true to ignore this exception and publish anyway.");
            }
            var fields = Array({
                'username': this.bxClient.getUsername(),
                'password': this.bxClient.getPassword(),
                'account': this.bxClient.getAccount(false),
                'owner': this.owner,
                'xml': this.getXML()
            });
            var url = this.host + this.URL_XML;
            return this.callAPI(fields, url);
        };
        BxData.prototype.checkChanges = function () {
            this.publishOwnerChanges(false);
        };
        BxData.prototype.publishChanges = function () {
            this.publishOwnerChanges(true);
        };
        BxData.prototype.publishOwnerChanges = function (publish) {
            if (publish === void 0) { publish = true; }
            if (this.isDev) {
                publish = false;
            }
            var fields = Array({
                'username': this.bxClient.getUsername(),
                'password': this.bxClient.getPassword(),
                'account': this.bxClient.getAccount(false),
                'owner': this.owner,
                'publish': (publish ? 'true' : 'false')
            });
            var url = this.host + this.URL_PUBLISH_CONFIGURATION_CHANGES;
            return this.callAPI(fields, url);
        };
        BxData.prototype.verifyCredentials = function () {
            var fields = Array({
                'username': this.bxClient.getUsername(),
                'password': this.bxClient.getPassword(),
                'account': this.bxClient.getAccount(false),
                'owner': this.owner
            });
            var url = this.host + this.URL_VERIFY_CREDENTIALS;
            return this.callAPI(fields, url);
        };
        BxData.prototype.alreadyExistingSourceId = function (sourceId, container) {
            return (typeof (this.sources[container][sourceId]) != "undefined" && this.sources[container][sourceId] !== null);
        };
        BxData.prototype.getUnusedSourceIdPostFix = function (sourceId, container) {
            var postFix = 2;
            var sorcContainer = this.sources[container];
            sorcContainer.forEach(function (sid) {
                var values = sorcContainer[sid];
                if (sid.indexOf(sourceId) === 0) {
                    var count = sid.replace(sourceId, '');
                    if (count >= postFix) {
                        postFix = count + 1;
                    }
                }
            });
            return postFix;
        };
        BxData.prototype.getSourceIdFromFileNameFromPath = function (filePath, container, maxLength, withoutExtension) {
            if (maxLength === void 0) { maxLength = 23; }
            if (withoutExtension === void 0) { withoutExtension = false; }
            var sourceId = this.getFileNameFromPath(filePath, withoutExtension);
            var shortened = false;
            if (sourceId.length > maxLength) {
                sourceId = sourceId.substring(0, maxLength);
                shortened = true;
            }
            if (this.alreadyExistingSourceId(sourceId, container)) {
                if (!shortened) {
                    throw new Error('Synchronization failure: Same source id requested twice "' + filePath + '". Please correct that only created once.');
                }
                var postFix = this.getUnusedSourceIdPostFix(sourceId, container);
                sourceId = sourceId + postFix;
            }
            return sourceId;
        };
        BxData.prototype.getFileNameFromPath = function (filePath, withoutExtension) {
            if (withoutExtension === void 0) { withoutExtension = false; }
            var parts = filePath.split('/');
            var file = parts[parts.length - 1];
            if (withoutExtension) {
                parts = file.split('.');
                return parts[0];
            }
            return file;
        };
        BxData.prototype.getFiles = function () {
            var files = Array();
            for (var container in this.sources) {
                var containerSources = this.sources[container];
                for (var sourceId in containerSources) {
                    var sourceValues = containerSources[sourceId];
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
        };
        BxData.prototype.createZip = function (temporaryFilePath, name, clearFiles) {
            if (temporaryFilePath === void 0) { temporaryFilePath = null; }
            if (name === void 0) { name = 'bxdata.zip'; }
            if (clearFiles === void 0) { clearFiles = true; }
            if (temporaryFilePath === null) {
                temporaryFilePath = tmp.dirSync() + '/bxclient';
            }
            if (temporaryFilePath != "" && !this.file_exists(temporaryFilePath)) {
                fs.mkdirSync(temporaryFilePath);
            }
            var zipFilePath = temporaryFilePath + '/' + name;
            if (this.file_exists(zipFilePath)) {
                fs.unlinkSync(zipFilePath);
            }
            var files = this.getFiles();
            for (var f in files) {
                var filePath = files[f];
                zip.file(filePath, ('sample_data').concat(f));
            }
            var data = zip.generate({ base64: false, compression: 'DEFLATE' });
            fs.writeFileSync('test.zip', data, 'binary');
            return zipFilePath;
        };
        BxData.prototype.pushData = function (temporaryFilePath, timeout, clearFiles) {
            if (temporaryFilePath === void 0) { temporaryFilePath = null; }
            if (timeout === void 0) { timeout = 60; }
            if (clearFiles === void 0) { clearFiles = true; }
            var zipFile = this.createZip(temporaryFilePath, 'bxdata.zip', clearFiles);
            var fields = Array({
                'username': this.bxClient.getUsername(),
                'password': this.bxClient.getPassword(),
                'account': this.bxClient.getAccount(false),
                'owner': this.owner,
                'dev': (this.isDev ? 'true' : 'false'),
                'delta': (this.isDelta ? 'true' : 'false'),
                'data': zipFile + "type=application/zip"
                //'data': this.getCurlFile(zipFile, "application/zip")
            });
            var url = this.host + this.URL_ZIP;
            return this.callAPI(fields, url, temporaryFilePath, timeout);
        };
        BxData.prototype.getTaskExecuteUrl = function (taskName) {
            return this.host + this.URL_EXECUTE_TASK + '?iframeAccount=' + this.bxClient.getAccount() + '&task_process=' + taskName;
        };
        BxData.prototype.publishChoices = function (isTest, taskName) {
            if (isTest === void 0) { isTest = false; }
            if (taskName === void 0) { taskName = "generate_optimization"; }
            if (this.isDev) {
                taskName = taskName + '_dev';
            }
            if (isTest) {
                taskName = taskName + '_test';
            }
            var url = this.getTaskExecuteUrl(taskName);
            this.file_get_contents(url);
        };
        BxData.prototype.prepareCorpusIndex = function (taskName) {
            if (taskName === void 0) { taskName = "corpus"; }
            var url = this.getTaskExecuteUrl(taskName);
            this.file_get_contents(url);
        };
        BxData.prototype.prepareAutocompleteIndex = function (fields, taskName) {
            if (taskName === void 0) { taskName = "autocomplete"; }
            var url = this.getTaskExecuteUrl(taskName);
            this.file_get_contents(url);
        };
        BxData.prototype.file_get_contents = function (url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "url", true);
            xhr.onload = function () {
                console.log(xhr.responseText);
            };
            xhr.send();
        };
        BxData.prototype.file_exists = function (file) {
            var isexists = false;
            fs.exists(file, function (exist) {
                if (exist) {
                    isexists = true;
                }
                else {
                    isexists = false;
                }
            });
            return isexists;
        };
        return BxData;
    }());
    exports.BxData = BxData;
});
//# sourceMappingURL=BxData.js.map