import _ = require("lodash");
import {PaletteItem} from "../model";
export class Parser{
    private schema;
    result = {
        "draggables" : {},
        "rootElement" : {}
    };
    private rootElement: PaletteItem;
    private pluralize = require('pluralize');

    constructor(){
        this.getSchema();
    }

    parseSchema(schema, paletteItem:PaletteItem): void{
        switch (schema.type){
            case "object":
                if (!schema.properties) {throw new Error("Invalid schema.");}
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

    helper(item: PaletteItem): Array<PaletteItem>{
        let result = [];
        for(var i in item.draggables){
            result.push(item.draggables[i]);
            result = result.concat(this.helper(item.draggables[i]));
        }
        return result;
    }

    getDraggables(){
        return this.helper(this.getRootElement());
    }

    getRootElement(){
        return this.rootElement;
    }

    getSchema(){
        this.schema = JSON.stringify(require("../resource/metaschema.json"));
        this.schema = JSON.parse(this.schema);
        this.rootElement = {
            'key': 'rootElement',
            'properties': this.schema,
            'draggables': {},
            'value': {},
            'uitreeNodes':{}
        };
        this.parseSchema(this.schema, this.rootElement);
        return this.result;
    }
}