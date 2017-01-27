import {Parser} from "../parser/Parser";
import {PaletteItem} from "../model";

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
    static $inject = ['parser','$mdDialog'];
    private mdDialog;
    private pluralize = require('pluralize');

    private treelist;
    private droppoints=[];
    private droplog=[];
    private hinttree;
    private showHintTree=false;

    constructor(parser:Parser,mdDialog: $mdDialog){
        this.mdDialog = mdDialog;
        let getRootElementPromise = parser.getRootElement();
        getRootElementPromise.then((res)=>{
            this.treelist = [res];
        });
        //this.treelist = Object.keys(rootElement.draggables).length?[parser.getRootElement()]:"error";
    }

    mastertreeOptions = {
        dropped: (event) => {
            //console.log(event);
            let value = event.dest.nodesScope.$nodeScope.$modelValue.value;
            let key = event.source.nodeScope.$modelValue.key;
            value[key].splice(event.source.index, 1);
            value[key].splice(event.dest.index,0,event.source.nodeScope.$modelValue.value);
        },
        accept: (sourceNodeScope, destNodesScope, destIndex) => {
            let nodeScope = destNodesScope.$nodeScope;
            if(nodeScope==undefined)
                return false;
            if(nodeScope.$modelValue !== undefined)
               return false;
            // let result = destNodesScope.$nodeScope.$modelValue.draggables.hasOwnProperty(sourceNodeScope.$modelValue.key);
            // let result = destNodesScope.$parent.$parent.$parent.$parent.key==sourceNodeScope.$modelValue.key;
            let result = nodeScope.key == sourceNodeScope.$modelValue.key;
            return result;

            // let result = destNodesScope.$nodeScope.$modelValue.draggables.hasOwnProperty(sourceNodeScope.$modelValue.key);

            // let log={};
            // let sourcekey=sourceNodeScope.$modelValue.key;
            // let destkey=destNodesScope.$nodeScope.$modelValue.key;
            // if(result===false){
            //     log["string"]="ERROR: Cannot drop "+sourcekey+" on "+destkey;
            //     log["timestamp"]=Date.now();
            //     this.hinttree=[];
            //     let hint={};
            //     hint["title"]=destkey;
            //     hint["nodes"]=[];
            //     for(let obj in nodeScope.$modelValue.draggables)
            //         hint["nodes"].push(obj);
            //     this.hinttree.push(hint);
            //     this.showHintTree=true;
            // } else if(result===true){
            //     log["string"] = "SUCCESS: Dropped "+sourcekey+" on "+destkey;
            //     log["timestamp"] = Date.now();
            //     this.showHintTree=false;
            // }
            // this.droplog.push(log);
            // return result;
        },
        dragStop : (event) => {
            //console.log("dragStop");
            //console.log(event);
        },

        beforeDrop : (event) => {
            //console.log("beforeDrop");
            //console.log(event);
        },
        dragMove:(event) => {
            //console.log("dragMove called");
        }
    };

    selectElement(node:PaletteItem){
        if (node.value == undefined) {
            node.value = {};
        }
        this.onSelectElement({schema: node.properties, data:node.value});
    }

    deleteElement(node){
        var child = node.$parent.$modelValue;
        var parent = node.$nodeScope.$parentNodeScope.$modelValue.value;
        parent = parent[this.pluralize.plural(child.key)];
        if (Array.isArray(parent)) {
            if (parent.indexOf(child.value) != -1) {
                parent.splice(parent.indexOf(child.value), 1);
            }
        } else if (typeof parent === 'object') {
            delete parent[child.value.objectKey];
        }
    }

    isRoot(node:PaletteItem){
        return node.key == "rootElement";
    }

    getLabel(node:PaletteItem){
        if (node.value == undefined) return node.key;
        if (node.value["objectKey"] != undefined) return node.value["objectKey"];
        let firstProperty = Object.keys(node.properties['properties'])[0];
        let result = node.value[firstProperty];
        if (result == undefined) {
            return node.key;
        }
        return result;
    }

    getChildren(node:PaletteItem,key:string):Array<Object>{
        let result = node.uitreeNodes[key];
        this.droppoints = node.uitreeNodes[key];
        if(!node.value.hasOwnProperty(key)){
            return result;
        }
        for(let i=node.uitreeNodes[key].length;i<node.value[key].length;i++) {
            let child = JSON.parse(JSON.stringify(node.draggables[key]));
            child.value = node.value[key][i];
            result.push(child);
        }
        this.droppoints = result;
        return result;
    }

    exportJSON(){
        this.mdDialog.show(
            this.mdDialog.confirm()
            .title("Result JSON")
            .htmlContent(`<pre>`+JSON.stringify(this.treelist[0].value,undefined,2)+`</pre>`)
            .ariaLabel('resultjson')
            .ok('OK'));
    }
}