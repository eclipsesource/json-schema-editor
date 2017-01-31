export interface PaletteItem {
    key: string;
    properties: Object;
    draggables: { [key:string]:PaletteItem; };
    value:Object;
    uitreeNodes: { [key:string]:Array<Object>; };
  }