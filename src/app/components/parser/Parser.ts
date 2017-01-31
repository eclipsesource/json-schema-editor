import _ = require("lodash");
import {PaletteItem} from "../model";
import {Promise} from "es6-promise";

export class Parser{
    private schema;
    private references;
    private rootElement: PaletteItem;
    private pluralize = require('pluralize');

    constructor(){
        this.loadSchema();
    }

    private parseSchema(schema, paletteItem:PaletteItem): void{
        switch (schema.type){
            case "object":
                if (!schema.properties) {throw new Error("Invalid schema. HINT : Possibly no properties present for the schema.");}
                for (var key in schema.properties) {
                    // Addables are within an array with type object
                    if (schema.properties[key]["type"] == "array") {
                        if (schema.properties[key]["items"]["type"] == "object") {
                            let item={};
                            item["key"]=key;
                            let definitionKey=this.findDefinitionKey(item)?this.findDefinitionKey(item):key;
                            let child : PaletteItem = {
                                'key': this.pluralize.singular(key),
                                'properties': schema.properties[key]["items"],
                                'draggables': {},
                                'value': {},
                                'uitreeNodes':{},
                                'definitionKey':this.pluralize.singular(definitionKey)
                            };
                            this.parseSchema(schema.properties[key]["items"], child);
                            paletteItem.draggables[this.pluralize.singular(key)] = child;
                            paletteItem.uitreeNodes[this.pluralize.singular(key)]=[];
                        }
                    } else if (schema.properties[key]["type"] == "object") {
                        // additionalProperties itself is an object, which should be an palette item
                        if (schema.properties[key]["additionalProperties"]["type"] == "object") {
                            let item={};
                            item["key"]=key;
                            let definitionKey=this.findDefinitionKey(item)?this.findDefinitionKey(item):key;
                            let child : PaletteItem = {
                                'key': this.pluralize.singular(key),
                                'properties': schema.properties[key]["additionalProperties"],
                                'draggables': {},
                                'value': {},
                                'uitreeNodes':{},
                                'definitionKey':this.pluralize.singular(definitionKey)
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

    private findDefinitionKey(item):string{
        let keys=Object.keys(this.references);
        for(let i=0;i<keys.length;i++){
            let tmp = keys[i].split("/");
            let key = tmp[tmp.length-1];
            if(key===item.key){
                let properties = this.references[keys[i]].uri;
                let property = properties.split("/");
                item.key=property[property.length-1];
            }
        }
        return item.key;
    }

    private checkIfExistsInDraggables(result,item):any{
        item.key=this.findDefinitionKey(item);
        for(let i=0;i<result.length;i++){
            if(result[i].key===item.key)
                return false;
        }
        return item;
    }

    private helper(item: PaletteItem): Array<PaletteItem>{
        let result = [];
        for(let i in item.draggables){
            //check is item already exists in draggables
            let res = this.checkIfExistsInDraggables(result,item.draggables[i]);
            if(res!==false)
                result.push(res);
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
            resolveSchemaPromise.then((res)=>{
                this.schema = res.resolved;
                this.references = res.refs;
                this.rootElement = {
                    'key': 'rootElement',
                    'properties': this.schema,
                    'draggables': {},
                    'value': {},
                    'uitreeNodes':{},
                    'definitionKey':'rootElement'
                };
                this.parseSchema(this.schema, this.rootElement);
                resolve(this.rootElement);
            });
        });
        return resolveGetRootElementPromise;
    }

    private loadSchema(){
        this.schema = JSON.stringify(require("../resource/metaschema.json"));
        this.schema = JSON.parse(this.schema);
    }

    private resolveSchema(): Promise<any>{
        var jsonrefs = require('json-refs');
        let jsonsrefsPromise = jsonrefs.resolveRefs(this.schema);
        return jsonsrefsPromise;
    }
}