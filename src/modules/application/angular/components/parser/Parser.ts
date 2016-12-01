import {HttpService} from "../../../../util/HttpService";

export class Parser extends HttpService{
    // TODO: get schema from http request
    /*schema = {
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
    };*/
    private schema;

    result = {
        "draggables" : {},
        "rootElement" : {}
    };

    /*constructor(public metaschemaLoaderService: MetaschemaLoaderService){
        this.loadSchema();
        this.result.rootElement = this.parseSchema(this.schema);
        console.log(this.result);
    }*/

    getMetaschema():ng.IPromise<any> {
        var path = "../resource/metaschema.json";
        var schema = this.get(path);
        console.log(schema);
        return schema;
    }

    loadSchema() {
        var url = "../resource/metaschema.json";
        this.getMetaschema().then((response: ng.IHttpPromiseCallbackArg<any>) => {
            this.schema = response.data;
            console.log(response.data);
        });
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