import _ = require("lodash");
import {PaletteItem} from "../model";
import {Promise} from "es6-promise";

export class Parser {
    private schema;
    private references;
    private rootElement:PaletteItem;
    private pluralize = require('pluralize');

    constructor() {
        this.loadSchema();
    }

    private createPaletteItemChild(key, properties):PaletteItem {
        let item = {};
        item["key"] = key;
        let definitionKey = this.findDefinitionKey(item) ? this.findDefinitionKey(item) : key;
        let child:PaletteItem = {
            'key': this.pluralize.singular(key),
            'properties': properties,
            'draggables': {},
            'value': {},
            'uitreeNodes': {},
            'definitionKey': this.pluralize.singular(definitionKey)
        };
        return child;
    }

    private getReferenceDetails(key, ref) {
        var refKeys = Object.keys(this.references);
        for (let i = 0; i < refKeys.length; i++) {
            if (ref["$ref"] === this.references[refKeys[i]].uri) {
                let item = {};
                item[key] = this.references[refKeys[i]]["value"];
                return item;
            }
        }
        throw new Error("Unable to resolve references. Please verify the schema");
    }

    private parseSchema(schema, paletteItem:PaletteItem):void {

        if (schema["anyOf"] !== undefined) {
            console.log("placeholder for resolving anyOf at the rootLevel");
        } else if (schema["$ref"] !== undefined) {
            console.log("placeholder for resolving $ref at root Level");
            let properties = schema["$ref"];
            let property = properties.split("/");
            let key = property[property.length - 1];
            var res = this.getReferenceDetails(key, schema);
            let item = {};
            item["key"] = key;
            if (res[key].type == "array") {
                if (res[key].items.type == "object") {
                    let child = this.createPaletteItemChild(key, res[key].items);
                    this.parseSchema(res[key].items, child);
                    paletteItem.draggables[this.pluralize.singular(key)] = child;
                    paletteItem.uitreeNodes[this.pluralize.singular(key)] = [];
                }
            }
        } else if (schema.type !== undefined) {
            //console.log("resolving type");
            //console.log(schema);
            switch (schema.type) {
                case "object":
                    if (!schema.properties) {
                        throw new Error("Invalid schema. HINT : Possibly no properties present for the schema.");
                    }
                    for (var key in schema.properties) {
                        if (schema.properties[key]["$ref"] !== undefined) {
                            var res = this.getReferenceDetails(key, schema.properties[key]);
                            let item = {};
                            item["key"] = key;
                            if (res[key].type == "array") {
                                if (res[key].items.type == "object") {
                                    let child = this.createPaletteItemChild(key, res[key].items);
                                    this.parseSchema(res[key].items, child);
                                    paletteItem.draggables[this.pluralize.singular(key)] = child;
                                    paletteItem.uitreeNodes[this.pluralize.singular(key)] = [];
                                }
                            }
                        }
                        else if (schema.properties[key]["type"] == "array") {
                            if (schema.properties[key]["items"]["type"] == "object") {
                                let child = this.createPaletteItemChild(key, schema.properties[key]["items"]);
                                this.parseSchema(schema.properties[key]["items"], child);
                                paletteItem.draggables[this.pluralize.singular(key)] = child;
                                paletteItem.uitreeNodes[this.pluralize.singular(key)] = [];
                            } else if(schema.properties[key]["items"]["anyOf"]!==undefined){
                                let anyOf = schema.properties[key]["items"]["anyOf"];
                                for (let i = 0; i < anyOf.length; i++) {
                                    if (anyOf[i]["$ref"] !== undefined) {
                                        let properties = anyOf[i]["$ref"];
                                        let property = properties.split("/");
                                        let refKey = property[property.length - 1];
                                        var res = this.getReferenceDetails(refKey, anyOf[i]);
                                        if (res[refKey].type == "array") {
                                            if (res[refKey].items.type == "object") {
                                                let child = this.createPaletteItemChild(refKey, res[refKey].items);
                                                this.parseSchema(res[refKey].items, child);
                                                paletteItem.draggables[this.pluralize.singular(refKey)] = child;
                                                paletteItem.uitreeNodes[this.pluralize.singular(refKey)] = [];
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        else if (schema.properties[key]["type"] == "object") {
                            // additionalProperties itself is an object, which should be an palette item
                            if (schema.properties[key]["additionalProperties"]["type"] == "object") {
                                let child = this.createPaletteItemChild(key, schema.properties[key]["additionalProperties"]);
                                schema.properties[key]["additionalProperties"]["properties"]["objectKey"] = {"type": "string"};
                                this.parseSchema(schema.properties[key]["additionalProperties"], child);
                                paletteItem.draggables[this.pluralize.singular(key)] = child;
                                paletteItem.uitreeNodes[this.pluralize.singular(key)] = [];
                            }
                        }
                    }
                default:
                    return;
            }
        }
    }

    private findDefinitionKey(item):string {
        let keys = Object.keys(this.references);
        for (let i = 0; i < keys.length; i++) {
            let tmp = keys[i].split("/");
            let key = tmp[tmp.length - 1];
            if (key === item.key) {
                let properties = this.references[keys[i]].uri;
                let property = properties.split("/");
                item.key = property[property.length - 1];
            }
        }
        return item.key;
    }

    private checkIfExistsInDraggables(result, item):any {
        item.key = this.findDefinitionKey(item);
        for (let i = 0; i < result.length; i++) {
            if (result[i].key === item.key) {
                return result[i];
            }
        }
        return false;
    }

    private helper(item:PaletteItem):Array<PaletteItem> {
        let result = [];
        for (let i in item.draggables) {
            //check is item already exists in draggables
            let res = this.checkIfExistsInDraggables(result, item.draggables[i]);
            if (!res)
                result.push(item.draggables[i]);
            let newItems = this.helper(item.draggables[i])
                .filter(item => !this.checkIfExistsInDraggables(result, item));

            result = result.concat(newItems);
        }
        return result;
    }

    getDraggables():Promise<Array<PaletteItem>> {
        var getRootElementPromise = this.getRootElement();
        var getDraggablesPromise = new Promise((resolve)=> {
            getRootElementPromise.then((res)=> {
                let flatNodes = this.helper(res);
                resolve(flatNodes);
            });
        });
        return getDraggablesPromise;
    }

    getRootElement():Promise<PaletteItem> {
        var resolveSchemaPromise = this.resolveSchema();

        var resolveGetRootElementPromise = new Promise((resolve)=> {
            resolveSchemaPromise.then((res)=> {
                //this.schema = res.resolved;
                this.references = res.refs;
                //console.log(this.schema);
                this.rootElement = {
                    'key': 'rootElement',
                    'properties': this.schema,
                    'draggables': {},
                    'value': {},
                    'uitreeNodes': {},
                    'definitionKey': 'rootElement'
                };
                this.parseSchema(this.schema, this.rootElement);
                resolve(this.rootElement);
            });
        });
        return resolveGetRootElementPromise;
    }

    private loadSchema() {
        this.schema = JSON.stringify(require("../resource/metaschema.json"));
        this.schema = JSON.parse(this.schema);
    }

    private resolveSchema():Promise<any> {
        var jsonrefs = require('json-refs');
        let jsonsrefsPromise = jsonrefs.resolveRefs(this.schema);
        return jsonsrefsPromise;
    }
}