import "./app/index.ts";
import "angular";

// load our default (non specific) css
import "font-awesome/css/font-awesome.css";
import "./styles/style.scss";

angular.module("app", ["app.application"]);
angular.bootstrap(document, ["app"], {
    strictDi: true
});