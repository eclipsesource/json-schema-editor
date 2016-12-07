import _ = require("lodash");
export class Parser{
    private schema;
    result = {
        "draggables" : {},
        "rootElement" : {}
    };

    parseSchema(schema){
        switch (schema.type){
            case "object":
                if (!schema.properties) {return {};}
                for (var key in schema.properties) {
                    // Additables are within an array with type object
                    if (schema.properties[key]["type"] == "array") {
                        if (schema.properties[key]["items"]["type"] == "object") {
                            this.result.draggables[key] = this.parseSchema(schema.properties[key]["items"]);
                        }
                    }
                    schema.properties[key] = this.parseSchema(schema.properties[key]);
                }
                return schema.properties;
            default:
                return schema;
        }
    }

    getDraggables(){
        var result=[];
        var schema = this.getSchema().draggables;
        for(var i in schema){
            var item = {};
            item["key"] = i;
            item["properties"] = _.get(schema,i);
            result.push(item);
        }
        return result;
    }

    getRootElement(){
        var schema = this.getSchema();
        var result = [];
        var item = {};
        item["key"] = 'rootElement';
        item["properties"] = _.get(schema,'rootElement');
        item["nodes"] = [];
        result.push(item);

        console.log("getRootElement");
        console.log(result);

        return result;
    }

    getSchema(){
        this.schema = JSON.stringify(require("../resource/metaschema.json"));
        this.schema = JSON.parse(this.schema);
        this.result.rootElement = this.parseSchema(this.schema);
        console.log("parser output");
        console.log(this.result);
        return this.result;
    }
}