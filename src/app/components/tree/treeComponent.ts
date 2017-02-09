import {Parser} from "../parser/Parser";
import {PaletteItem} from "../model";

export class TreeComponent implements ng.IComponentOptions {
    public controller: Function = TreeController;
    public template: string = require('./treeComponent.html');
    public bindings: any = {
        onSelectElement : '&'
    };
}
export class TreeController {
    public onSelectElement: Function;
    private parser: Parser;
    static $inject = ['parser','$mdDialog', 'jsonFilter'];
    private mdDialog;
    private pluralize = require('pluralize');

    private treelist;
    private droppoints=[];
    private droplog=[];
    private hinttree;
    private showHintTree=false;
    public isHintVisible=false;

    constructor(parser:Parser,mdDialog: $mdDialog, private jsonFilter: jsonFilter){
        this.parser = parser;
        this.mdDialog = mdDialog;
        let getRootElementPromise = parser.getRootElement();
        getRootElementPromise.then((res)=>{
            this.treelist = Object.keys(res.draggables).length?[res]:"error";
        });

    }

    mastertreeOptions = {
        dropped: (event) => {
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
            return sourceNodeScope.$modelValue.key===destNodesScope.$nodeScope.value.definitionKey;
        },
        dragStop : (event) => {},
        beforeDrop : (event) => {},
        dragMove:(event) => {}
    };

    selectElement(node:PaletteItem){
        if (node.value == undefined) {
            node.value = {};
        }
        this.onSelectElement({schema: node.properties, data:node.value});
    }

    deleteElement(node){
        var child = node.$parent.$modelValue;
        var parent = node.$parent.$parentNodeScope.$parentNodeScope.$modelValue.value;
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
        if (node.value.hasOwnProperty("label")) return node.value["label"];
        let firstProperty = Object.keys(node.properties['properties'])[0];
        let result = node.value[firstProperty];
        if (result == undefined) {
            return node.key;
        }
        return result;
    }

    toggleHint(){
        this.isHintVisible = !this.isHintVisible;
    }

    checkHint(node:PaletteItem){
      return Object.keys(node.draggables).length > 1 || this.isHintVisible;
    }

    getHintButtonText(){
        return this.isHintVisible ? 'Hide Hint' : 'Show Hint';
    }

    getHintKey(key:string){
        return this.pluralize.plural(key);
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
            this.mdDialog.alert()
                .title("Result JSON")
                .htmlContent(`<pre>`+ this.jsonFilter(JSON.parse(JSON.stringify(this.treelist[0].value,undefined,2)))+`</pre>`)
                .ariaLabel('resultjson')
                .ok('OK'));
    }
}