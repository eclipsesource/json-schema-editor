import "angular";

import {TreeMasterDetailComponent} from "./components/tree-master-detail-panel/TreeMasterDetailComponent";
import {PropertiesComponent} from "./components/properties-panel/PropertiesComponent";
import {JsonSchemaEditorApplicationComponent} from "./components/jsonSchemaEditorApplication/JsonSchemaEditorApplicationComponent";
import {ItemComponent} from "./components/item-panel/ItemComponent";
import {HeaderComponent} from "./components/header/HeaderComponent";
import {Parser} from "./components/parser/Parser";
//import {MetaschemaLoaderService} from "./components/parser/MetaschemaLoaderService";

angular.module("app.application", [])
    //.service('metaschemaLoaderService', MetaschemaLoaderService)
    .component("jsonSchemaEditorApplication", new JsonSchemaEditorApplicationComponent())
    .component("headerComponent", new HeaderComponent())
    .component("itemComponent", new ItemComponent())
    .component("treeMasterDetailComponent", new TreeMasterDetailComponent())
    .component("propertiesComponent", new PropertiesComponent())
    .service("parser", Parser);