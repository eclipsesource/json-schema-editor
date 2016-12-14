/**
 * Created by Akash on 11/23/2016.
 */
export class HeaderComponent implements ng.IComponentOptions {
    public controller: Function = HeaderController;
    public template: string = `
        <div class="navbar-brand">
            JSON Schema Editor
        </div>
            `;
}
export class HeaderController {

}