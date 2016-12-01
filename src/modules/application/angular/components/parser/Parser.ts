export class Parser{
    // TODO: get schema from http request
    private schema;

    result = {
        "draggables" : {},
        "rootElement" : {}
    };

    getSchema(): any{
        var schema = require("../resource/metaschema.json");
        return schema;
    }

    parseSchema(schema){

        switch (schema.type){
            case "object":
                if (!schema.properties) {return {};}
                for (var key in schema.properties) {
                    // Item in array is draggable
                    if (schema.properties[key]["type"] == "array") {
                        var subSchema = this.parseSchema(schema.properties[key]["items"]);
                        this.result.draggables[key] = subSchema;
                    }
                    schema.properties[key] = this.parseSchema(schema.properties[key]);
                }
                return schema.properties;
            case "array":
                return [];
            case "string":
                return "";
            default:
                return;
        }
    }
}