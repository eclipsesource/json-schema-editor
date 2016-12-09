import _ = require("lodash");
export class Parser{
    private schema;
    result = {
        "draggables" : {},
        "rootElement" : {}
    };
    private rootElement: PaletteItem;

    constructor(){
      this.getSchema();
    }

    parseSchema(schema, paletteItem:PaletteItem): void{
        switch (schema.type){
            case "object":
                if (!schema.properties) {throw new Error("Invalid schema.");}
                for (var key in schema.properties) {
                    // Additables are within an array with type object
                    if (schema.properties[key]["type"] == "array") {
                        if (schema.properties[key]["items"]["type"] == "object") {
                          let child : PaletteItem = {
                            'key': key,
                            'properties': schema.properties[key]["items"],
                            'draggables': {}
                          };
                          this.parseSchema(schema.properties[key]["items"], child);
                          paletteItem.draggables[key] = child;
                        }
                    }
                    // schema.properties[key] = this.parseSchema(schema.properties[key]);
                }
                // return schema.properties;
            default:
                return;
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
        // var result=[];
        // var schema = this.getRootElement().draggables;
        // for(var i in schema){
        //     result.push(schema[i]);
        //
        //     // var item = {};
        //     // item["key"] = i;
        //     // item["properties"] = _.get(schema,i);
        //     // var prop = item["properties"]
        //     // item["droppable"] = {};
        //
        //     // for(var j in prop){
        //     //     if(prop[j].type==='array'){
        //     //         // item["nodes"] = [];
        //     //         item["droppable"][j] = prop[j].items;
        //     //     }
        //     // }
        //     //
        //     // result.push(item);
        // }
        // return result;
    }

    getRootElement(){
        // var schema = this.getSchema();
        // var result = [];
        // var item = {};
        // item["key"] = 'rootElement';
        // item["properties"] = _.get(schema,'rootElement');
        // item["nodes"] = [];
        // result.push(item);
        // return result;
        return this.rootElement;
    }

    getSchema(){
        this.schema = JSON.stringify(require("../resource/metaschema.json"));
        this.schema = JSON.parse(this.schema);
        this.rootElement = {
          'key': 'rootElement',
          'properties': this.schema,
          'draggables': {}
        };
        this.parseSchema(this.schema, this.rootElement);
        return this.result;
    }
}

interface PaletteItem {
    key: string;
    properties: Object;
    draggables: { [key:string]:PaletteItem; };
  }