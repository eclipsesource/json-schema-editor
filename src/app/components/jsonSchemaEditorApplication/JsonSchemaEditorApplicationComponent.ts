export class JsonSchemaEditorApplicationComponent implements ng.IComponentOptions{
    public template : string = require('./jsonSchemaEditorAppComponent.html');
    public controller : Function = JsonSchemaEditorApplicationController;
}

export class JsonSchemaEditorApplicationController{
    public schema;
    public selectedElement = "";
    public selectElement(schema, data){
        this.schema = schema;
        this.selectedElement = data;
    }
}