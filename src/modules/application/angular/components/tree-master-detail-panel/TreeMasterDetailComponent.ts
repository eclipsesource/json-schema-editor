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

    private treelist;

    constructor(parser:Parser){
        this.treelist = [parser.getRootElement()];
    }

    mastertreeOptions = {
        dropped: (event) => {
            console.log(event);
            // event.dest.value[event.dest.nodesScope.key] = event.source.value;

        },
        accept: (sourceNodeScope, destNodesScope, destIndex) => {
            //check if destnode and parent node are same and return false if true to avoid unlimited nesting
            // if(destNodesScope.$parent.$modelValue){
            //     if(sourceNodeScope.item.key===destNodesScope.$parent.$modelValue.key)
            //         return false;
            // }
            console.log("accept called");
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
        dragMove:(event) => {
          console.log("dragMove called");
        }
    };

    prepareNode(node, key){
      if (node.uitreeNodes == undefined){
        node.uitreeNodes = {};
      }
      node.uitreeNodes[key] = [];
    }

    showKey(key){
        return key!=='draggables'?true:false;
    }

    selectElement(node){
        console.log("Element selected", node);
        if (node.value == undefined) {
          node.value = {};
        }
        this.onSelectElement({schema: node.properties, data:node.value});
    }

    getLabel(node){
      let firstProperty = Object.keys(node.properties.properties)[0];
      if (node.value == undefined) return node.key;
      let result = node.value[firstProperty];
      if (result == undefined) {
        return node.key;
      }
      return result;
    }
}