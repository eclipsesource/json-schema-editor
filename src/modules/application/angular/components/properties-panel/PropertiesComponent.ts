export class PropertiesComponent implements ng.IComponentOptions {
    public controller : Function = PropertiesController;
    public template : string = require('./propertiesComponent.html');
    public bindings : any = {
        schema: '<',
        data: '<'
    }
}
export class PropertiesController {
}