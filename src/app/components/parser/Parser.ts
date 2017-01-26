import _ = require("lodash");
import {PaletteItem} from "../model";
import {Promise} from "es6-promise";

export class Parser{
    private schema;
    private rootElement: PaletteItem;
    private pluralize = require('pluralize');

    constructor(){
        this.loadSchema();
    }

    parseSchema(schema, paletteItem:PaletteItem): void{
        switch (schema.type){
            case "object":
                if (!schema.properties) {throw new Error("Invalid schema. HINT : Possibly no properties present for the schema.");}
                for (var key in schema.properties) {
                    // Addables are within an array with type object
                    if (schema.properties[key]["type"] == "array") {
                        if (schema.properties[key]["items"]["type"] == "object") {
                            let child : PaletteItem = {
                                'key': this.pluralize.singular(key),
                                'properties': schema.properties[key]["items"],
                                'draggables': {},
                                'value': {},
                                'uitreeNodes':{}
                            };
                            this.parseSchema(schema.properties[key]["items"], child);
                            paletteItem.draggables[this.pluralize.singular(key)] = child;
                            paletteItem.uitreeNodes[this.pluralize.singular(key)]=[];
                        }
                    } else if (schema.properties[key]["type"] == "object") {
                        // additionalProperties itself is an object, which should be an palette item
                        if (schema.properties[key]["additionalProperties"]["type"] == "object") {
                            let child : PaletteItem = {
                                'key': this.pluralize.singular(key),
                                'properties': schema.properties[key]["additionalProperties"],
                                'draggables': {},
                                'value': {},
                                'uitreeNodes':{}
                            };
                            schema.properties[key]["additionalProperties"]["properties"]["objectKey"]={"type": "string"};
                            this.parseSchema(schema.properties[key]["additionalProperties"], child);
                            paletteItem.draggables[this.pluralize.singular(key)] = child;
                            paletteItem.uitreeNodes[this.pluralize.singular(key)]=[];
                        }
                    }
                }
            default: return;
        }
    }

    checkIfExists(result,item):boolean{
        for(let i=0;i<result.length;i++){
            if(result[i].key===item.key)
                return false;
        }
        return true;
    }

    helper(item: PaletteItem): Array<PaletteItem>{
        let result = [];
        for(let i in item.draggables){
            if(this.checkIfExists(result,item.draggables[i]))
                result.push(item.draggables[i]);
            result = result.concat(this.helper(item.draggables[i]));
        }
        return result;
    }

    getDraggables():Promise<Array<PaletteItem>>{
        var getRootElementPromise = this.getRootElement();
        var getDraggablesPromise = new Promise((resolve)=>{
            getRootElementPromise.then((res)=>{
                resolve(this.helper(res));
            });
        });
        return getDraggablesPromise;
    }

    getRootElement():Promise<PaletteItem>{
        var resolveSchemaPromise = this.resolveSchema();

        var resolveGetRootElementPromise = new Promise((resolve)=>{
            resolveSchemaPromise.then((ref)=>{
                this.schema = ref.resolved;
                this.rootElement = {
                    'key': 'rootElement',
                    'properties': this.schema,
                    'draggables': {},
                    'value': {},
                    'uitreeNodes':{}
                };
                this.parseSchema(this.schema, this.rootElement);
                resolve(this.rootElement);
            });
        });
        return resolveGetRootElementPromise;
    }

    loadSchema(){
        this.schema = JSON.stringify(require("../resource/metaschema.json"));
        this.schema = JSON.parse(this.schema);
    }

    resolveSchema(): Promise<any>{
        var jsonrefs = require('json-refs');
        let jsonsrefsPromise = jsonrefs.resolveRefs(this.schema);
        return jsonsrefsPromise;
    }
}