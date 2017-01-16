export class HeaderComponent implements ng.IComponentOptions {
    public controller: Function = HeaderController;
    public template: string = `
        <div class="navbar-brand">
            <b>JSON SCHEMA EDITOR</b>
        </div>
            `;
}
export class HeaderController {

}