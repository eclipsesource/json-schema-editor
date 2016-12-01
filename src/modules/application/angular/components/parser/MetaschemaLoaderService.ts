import {HttpService} from "./../../../../util/HttpService";

export class MetaschemaLoaderService extends HttpService {

    public getMetaschema():ng.IPromise<any> {
        var path = "./metaschema.json";
        var schema = this.get(path);
        console.log(schema);
        return schema;
    }
}