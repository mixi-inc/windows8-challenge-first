(function () {
    'use strict';

    /**
     * Private
     */

    /**
     * GraphAPIに向けてXMLHttpRequestを送るPromiseを返します
     *
     * @name _graphAPIRequest
     * @param accessToken {String} アクセストークン
     * @param method   {String}  HTTPのメソッド（GET/POST/PUT/DELETE）
     * @param path     {String}  リクエストを送るパスの指定
     * @return {WinJS.Promise} 処理のPromiseオブジェクト
     */
    function _graphAPIRequest(accessToken, method, path) {

        return new WinJS.xhr({
            type: method,
            url: Config.ACCESS_API.GRAPH_API_ENDPOINT.URL + path,
            headers: {
                'If-Modified-Since': Config.ACCESS_API.OLD_MODIFIED_SINCE,
                'Authorization ': 'OAuth ' + accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * Public - GraphAPI
     */

    /**
     * Photo
     */

    /**
     * 自分自身のかんたん公開アルバムのフォト一覧情報を取得
     *
     * @name getDefaultAlbumPhotos
     * @param accessToken {String} アクセストークン
     * @return {WinJS.Promise} 処理のPromiseオブジェクト
     * @see http://developer.mixi.co.jp/connect/mixi_graph_api/mixi_io_spec_top/photo-api/#toc-4
     */
    function getDefaultAlbumPhotos(accessToken) {
        return _graphAPIRequest(accessToken, 'GET', '/photo/mediaItems/@me/@self/@default?count=50')
        .then(function (result) {
            return JSON.parse(result.responseText);
        });
    }

    WinJS.Namespace.define('APIRequester', {
        getDefaultAlbumPhotos: getDefaultAlbumPhotos
    });
})();
