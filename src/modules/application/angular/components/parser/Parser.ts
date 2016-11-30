export class Parser {
    // TODO: get schema from http request
    schema = {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "classes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "attributes": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "visibility": {
                      "type": "string",
                      "enum": ["Public", "Private","Protected"]
                    },
                    "type": {
                      "type": "string",
                      "enum": ["Boolean","Integer","Real","String"]
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    result = {
        "draggables" : {},
        "rootElement" : {}
    };

    constructor(){
        this.result.rootElement = this.parseSchema(this.schema);
        console.log(this.result);
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