import "./modules/application/angular/index";
import "angular";

// load our default (non specific) css
import "font-awesome/css/font-awesome.css";
import "./styles/style.css";

angular.module("app", ["app.application"]);
angular.bootstrap(document, ["app"], {
    strictDi: true
});