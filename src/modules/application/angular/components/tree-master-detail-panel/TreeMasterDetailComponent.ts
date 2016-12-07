import {Parser} from "../parser/Parser";

export class TreeMasterDetailComponent implements ng.IComponentOptions {
    public controller: Function = TreeMasterDetailController;
    public template : string = require('./TreeMasterDetailComponent.html')
}
export class TreeMasterDetailController {
    private parser: Parser;
    static $inject = ['parser'];

    treelist;

    constructor(parser:Parser){

        this.treelist = parser.getRootElement();

    }

    mastertreeOptions = {
        dropped: (event) => {
            console.log(event);
        },
        accept: (sourceNodeScope, destNodesScope, destIndex) => {
            //check if destnode and parent node are same and return false if true to avoid unlimited nesting
            if(destNodesScope.$parent.$modelValue){
                if(sourceNodeScope.item.key===destNodesScope.$parent.$modelValue.key)
                    return false;
            }
            return true;
        },
        dragStop : (event) => {
            console.log("dragStop");
            console.log(event);
        },

        beforeDrop : (event) => {
            console.log("beforeDrop");
            console.log(event);
        },
    };

}