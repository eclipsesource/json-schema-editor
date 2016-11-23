export class JsonSchemaEditorApplicationComponent implements ng.IComponentOptions{
    public template: string = `

        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <header-component></header-component>
                </div>
            </div>
        </nav>

        <div class="col-md-4">
                <item-component></item-component>
            </div>
            <div class="col-md-4">
                <tree-master-detail-component></tree-master-detail-component>
            </div>
            <div class="col-md-4">
                <properties-component></properties-component>
            </div>
        </div>

        `;
}