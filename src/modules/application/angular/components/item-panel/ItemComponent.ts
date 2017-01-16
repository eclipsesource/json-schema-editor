import {Parser} from "../parser/Parser";

export class ItemComponent implements ng.IComponentOptions {
    public controller: Function = ItemController;
    public template : string = require('./itemComponent.html')
}
export class ItemController {
    static $inject = ['parser'];
    private parser: Parser;
    private itemlist;

    constructor(parser:Parser){
        this.itemlist = parser.getDraggables();
    }

    mastertreeOptions = {
        dropped: (event) => {
            // Object defined by additionalProperties has a key field
            if (event.source.cloneModel.properties.properties.key) {
                var key = prompt("Please enter key of object", "");
                event.source.cloneModel.value.key = key;
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
            // console.log(event);
        },
        dragMove:(event) => {
        //   console.log("dragMove called");
        }
    };
}