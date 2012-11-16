// ■依存
// tokenManager.js
// APIRequester.js

(function () {
    "use strict";

    /**
     * かんたん公開にアップされているフォトの情報を取得します
     *
     * @name getAsync
     * @param なし
     * @return {WinJS.Promise} 処理のPromiseオブジェクト
     */
    function getAsync() {

        return TokenManager.getTokenAsync()
        .then(function (token) {
            return APIRequester.getDefaultAlbumPhotos(token);
        })
        .then(function (result) {
            var photoArray = [];

            result.entry.forEach(function (it) {
                photoArray.push({
                    title: it.title,
                    src: it.thumbnailUrl,
                    largeSrc: it.largeImageUrl,
                    created: it.created,
                    url: it.url
                });
            });

            return photoArray;
        });
    }

    WinJS.Namespace.define("PhotoModel", {
        getAsync: getAsync
    });
})();