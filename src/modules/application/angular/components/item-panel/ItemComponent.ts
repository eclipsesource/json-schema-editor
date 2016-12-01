import {Parser} from "../parser/Parser";

export class ItemComponent implements ng.IComponentOptions {
    public controller: Function = ItemController;
    public template : string = require('./itemComponent.html')
}
export class ItemController {
    private parser: Parser;
    static $inject = ['parser'];

    constructor(parser:Parser){
        parser.loadSchema();
    }
}