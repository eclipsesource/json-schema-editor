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
            console.log("dropped");
            console.log(event);
        },
        accept: (sourceNodeScope, destNodesScope, destIndex) => {
            console.log(sourceNodeScope.$parent.$id);
            console.log(destNodesScope.$id);
            console.log(sourceNodeScope.item);
            console.log(destIndex);
            console.log(this.treelist);
            return true;
        },
        dragStop : (event) => {
            console.log("dragStop" + event);
        },

        beforeDrop : (event) => {
            console.log("beforeDrop" + event);
        },
    };

    showKey(key){
        return key!=='draggables'?true:false;
    }
}