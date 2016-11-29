import "./modules/application/angular/index";
import "angular";

// load our default (non specific) css
import "font-awesome/css/font-awesome.css";
import "bootstrap/dist/css/bootstrap.css";
import "angular-ui-tree/dist/angular-ui-tree.js"
import "angular-ui-tree/dist/angular-ui-tree.min.css"

angular.module("app", ["app.application", "ui.tree"]);
angular.bootstrap(document, ["app"], {
    strictDi: true
});