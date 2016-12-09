import IScope = angular.IScope;

export class PropertiesComponent implements ng.IComponentOptions {
    public controller : Function = PropertiesController;
    public template : string = require('./propertiesComponent.html');
    public bindings : any = {
        schema: '<',
        data: '='
    }
}
export class PropertiesController {
  schema;
  data;
  static $inject = ['$scope'];
  constructor($scope:IScope) {
            $scope.$on('modelChanged', () => {
                console.log("changes");
            });
  }
  show(){
    console.log(this.schema, this.data);
  }
}