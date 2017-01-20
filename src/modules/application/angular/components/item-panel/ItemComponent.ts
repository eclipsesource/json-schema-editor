import {Parser} from "../parser/Parser";

export class ItemComponent implements ng.IComponentOptions {
    public controller: Function = ItemController;
    public template : string = require('./itemComponent.html')
}
export class ItemController {
    static $inject = ['parser'];
    private parser: Parser;
    private itemlist;
    private pluralize = require('pluralize');

    constructor(parser:Parser){
        let paletteItems = parser.getDraggables();
        //this.itemlist = parser.getDraggables();

        if(paletteItems[0]===undefined)
            this.itemlist = "error";
        else
            this.itemlist = parser.getDraggables();
    }

    mastertreeOptions = {
        dropped: (event) => {
            // Object defined by additionalProperties has a key field
            if (event.dest.nodesScope.$nodeScope == null) return;
            console.log(event);
            let dest = event.dest.nodesScope.$nodeScope.$parent.node.value;
            let key = this.pluralize.plural(event.source.cloneModel.key);
            let isObject = event.source.cloneModel.properties.properties.objectKey;
            if (isObject) {
                var objectKey = prompt("Please enter key of object", "");
                event.source.cloneModel.value.objectKey = objectKey;
                if (dest[key] == undefined) dest[key] = {};
                dest[key][objectKey] = event.source.cloneModel.value;
            } else {
                if (dest[key] == undefined) dest[key] = new Array();
                dest[key].push(event.source.cloneModel.value);
            }
            // let value = event.dest.nodesScope.$nodeScope.$modelValue.value;
            // let key = event.source.cloneModel.key;
            // if(!value.hasOwnProperty(key)){
            //   value[key]=[];
            // }
            //  value[key].splice(event.index,0,event.source.cloneModel.value);
        },
        accept: (sourceNodeScope, destNodesScope, destIndex) => {
            return false;
        },
        dragStop : (event) => {
            // console.log("dragStop");
            // console.log(event);
        },

        beforeDrop : (event) => {
            // console.log("beforeDrop");
            // console.log(ev