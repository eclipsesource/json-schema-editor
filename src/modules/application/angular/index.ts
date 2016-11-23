import "angular";

import {TreeMasterDetailComponent} from "./components/tree-master-detail-panel/TreeMasterDetailComponent";
import {PropertiesComponent} from "./components/properties-panel/PropertiesComponent";
import {JsonSchemaEditorApplicationComponent} from "./components/jsonSchemaEditorApplication/JsonSchemaEditorApplicationComponent";
import {ItemComponent} from "./components/item-panel/ItemComponent";
import {HeaderComponent} from "./components/header/HeaderComponent";

angular.module("app.application", [])
    .component("jsonSchemaEditorApplication", new JsonSchemaEditorApplicationComponent())
    .component("headerComponent", new HeaderComponent())
    .component("itemComponent", new ItemComponent())
    .component("treeMasterDetailComponent", new TreeMasterDetailComponent())
    .component("propertiesComponent", new PropertiesComponent());