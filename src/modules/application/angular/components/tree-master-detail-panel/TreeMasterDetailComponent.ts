export class TreeMasterDetailComponent implements ng.IComponentOptions {
    public controller : Function = TreeMasterDetailController;
    public template : string = require('./TreeMasterDetailComponent.html');
    public bindings : any = {
        onSelectElement: '&'
    };
}
export class TreeMasterDetailController {
    public selectElement(){
        this.onSelectElement({schema: this.schema, data: this.data});
    }
    public schema = {
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
    public data={
      "name": "Domain Model Example",
      "classes": [
        {
          "name": "Person",
          "attributes": [
            {"name": "firstName", "visibility": "Public", "type": "String"},
            {"name": "lastName", "visibility": "Public", "type": "String"},
            {"name": "age", "visibility": "Private","type": "Number"}
          ]
        },
        {
          "name": "Project",
          "attributes": [
            {"name": "id", "visibility": "Private", "type": "String"},
            {"name": "name", "visibility": "Public", "type": "String"},
            {"name": "description", "visibility": "Public","type": "String"}
          ]
        }
      ]
    };

}