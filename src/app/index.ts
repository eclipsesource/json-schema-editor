import "angular";
import "angular-ui-tree/dist/angular-ui-tree.js";
import "angular-ui-tree/dist/angular-ui-tree.min.css";
import "angular-ui-tree/examples/css/app.css";
import "jsonforms/dist/jsonforms.css";
import "angular-ui-bootstrap/dist/ui-bootstrap.js"
import "bootstrap/dist/css/bootstrap.min.css";
import "angular-material/angular-material.js";
import "angular-material/angular-material.css";
import "angular-animate/angular-animate.js";
import "angular-aria/angular-aria.js";
import "angular-sanitize/angular-sanitize.js";
require('jsonforms');

import {TreeComponent} from "./components/tree/TreeComponent";
import {PropertiesComponent} from "./components/properties-panel/PropertiesComponent";
import {JsonSchemaEditorApplicationComponent} from "./components/jsonSchemaEditorApplication/JsonSchemaEditorApplicationComponent";
import {PaletteComponent} from "./components/palette/paletteComponent";
import {HeaderComponent} from "./components/header/HeaderComponent";
import {Parser} from "./components/parser/Parser";

angular.module("app.application", ['ui.tree', 'jsonforms','ui.bootstrap','ngAnimate','ngAria','ngMaterial','ngSanitize'])
    .component("jsonSchemaEditorApplication", new JsonSchemaEditorApplicationComponent())
    .component("headerComponent", new HeaderComponent())
    .component("paletteComponent", new PaletteComponent())
    .component("treeComponent", new TreeComponent())
    .component("propertiesComponent", new PropertiesComponent())
    .service("parser", Parser);