/**
 * Created by Akash on 11/23/2016.
 */
export class HeaderComponent implements ng.IComponentOptions {
    public controller: Function = HeaderController;
    public template: string = `
        <div>
            <h3>JSON Schema Editor</h3>
        </div>
            `;
}
export class HeaderController {

}