import {Parser} from "../parser/Parser";

export class TreeMasterDetailComponent implements ng.IComponentOptions {
    public controller: Function = TreeMasterDetailController;
    public template: string = require('./TreeMasterDetailComponent.html');
    public bindings: any = {
        onSelectElement : '&'
    };
}
export class TreeMasterDetailController {
    public onSelectElement: Function;
    private parser: Parser;
    static $inject = ['parser'];

    treelist;
    data;
    schema;

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

    showKey(key){
        return key!=='draggables'?true:false;
    }

    selectElement(node){
        // console.log("Element selected", node);
        this.schema = {
          type: "object",
          properties: node.properties
        };
        this.data = node.value ? node.value : {};
        this.onSelectElement({schema: this.schema, data:this.data});
    }
}