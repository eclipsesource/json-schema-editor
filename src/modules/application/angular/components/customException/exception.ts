export class CustomException {
    private errormsg;

    static $inject = ['$mdDialog'];
    mdDialog: $mdDialog;

    //no inspection TypeScript UnresolvedVariable
    constructor(){
        // works when <mdDialog: $mdDialog> is added as a parameter inside the constructor but not otherwise.
        //mdDialog: $mdDialog;
        //this.mdDialog = mdDialog;
    }

    // to show exceptions in a dialog
    showParseExceptionDialog(msg){

        this.errormsg=msg;
        /*this.mdDialog.show(
            this.mdDialog.confirm()
                .title("ERROR")
                .htmlContent(this.errormsg)
                .ariaLabel('errorparsing')
                .ok('OK')
        );*/
    }

    // in case any exceptions have to be logged
    logException(msg){
        this.errormsg=msg;
    }
}