export class HttpService {

    $http: ng.IHttpService;

    static $inject = ['$http'];

    constructor($http: ng.IHttpService) {
        this.$http = $http;
    }

    get(url: string, config = {}): ng.IPromise<any> {
        return this.$http.get(url, config);
    }

    delete(url: string, config = {}): ng.IPromise<any> {
        return this.$http.delete(url, config);
    }

    head(url: string, config = {}): ng.IPromise<any> {
        return this.$http.head(url, config);
    }

    jsonp(url: string, config = {}): ng.IPromise<any> {
        return this.$http.jsonp(url, config);
    }

    post(url: string, data = {}, config = {}): ng.IPromise<any> {
        return this.$http.post(url, data, config);
    }

    put(url: string, data = {}, config = {}): ng.IPromise<any> {
        return this.$http.put(url, data, config);
    }

    patch(url: string, data = {}, config = {}): ng.IPromise<any> {
        return this.$http.patch(url, data, config);
    }
}