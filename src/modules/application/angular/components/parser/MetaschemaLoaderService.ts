import {HttpService} from "./../../../../util/HttpService";

export class MetaschemaLoaderService extends HttpService {

    getMetaschema():ng.IPromise<any> {
        var path = "../../../assets/resource/metaschema.json";
        var schema = this.get(path);
        console.log(schema);
        return schema;
    }
}