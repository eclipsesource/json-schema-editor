import {Parser} from "../parser/Parser";

export class PaletteComponent implements ng.IComponentOptions {
    public controller: Function = PaletteController;
    public template : string = require('./paletteComponent.html')
}
export class PaletteController {
    static $inject = ['parser'];
    private parser: Parser;
    private itemlist;
    private pluralize = require('pluralize');

    constructor(parser:Parser){
        let getDraggablesPromise = parser.getDraggables();
        getDraggablesPromise.then((paletteItems)=>{
            this.itemlist = paletteItems[0]===undefined?"error":paletteItems;
        });
    }

    mastertreeOptions = {
        dropped: (event) => {
            // Object defined by additionalProperties has a key field
            if (event.dest.nodesScope.$nodeScope == null) return;
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
            // do not accept any item dropping on the palette item list itself.
            return false;
        },
        dragStop : (event) => {},
        beforeDrop : (event) => {},
        dragMove:(event) => {}
    };
}