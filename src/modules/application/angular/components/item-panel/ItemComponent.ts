/**
 * Created by Akash on 11/23/2016.
 */
export class ItemComponent implements ng.IComponentOptions {
    public controller: Function = ItemController;
    public template: string = `
        <div>
            <h3>Items</h3>
        </div>
            `;
}
export class ItemController {

}