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

    getSchema(){
        this.schema = JSON.stringify(require("../resource/metaschema.json"));
        this.schema = JSON.parse(this.schema);
        this.result.rootElement = this.parseSchema(this.schema);
        return this.result;
    }
}