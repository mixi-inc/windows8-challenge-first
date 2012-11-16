(function () {
    'use strict';

    /**
     * Public (Getter)
     */
    var getAccessAPI = (function () {
        var _CLIENT_ID = '',             // ClientID。ご自身のものを入力してください
            _CLIENT_SECRET = '',         // ClientSecret。ご自身のものを入力してください
            _AUTH_REDIRECT_URI = '',     // サービスで設定可能なリダイレクトURL。ご自身のものを入力してください
            _AUTH_CODE_URI = 'https://mixi.jp/connect_authorize.pl',
            _AUTH_ENDPOINT = 'https://secure.mixi-platform.com/2/token',
            _GRAPH_API_ENDPOINT = {
                URL: 'http://api.mixi-platform.com/2',
                SECURE_URL: 'https://api.mixi-platform.com/2'
            },
            _OLD_MODIFIED_SINCE = 'Mon, 27 Mar 1972 00:00:00 GMT',
            _ACCESS_SCOPE = ['r_photo', 'w_photo'].join(' ');
        return {
            CLIENT_ID: _CLIENT_ID,
            CLIENT_SECRET: _CLIENT_SECRET,
            AUTH_CODE_URI: _AUTH_CODE_URI,
            AUTH_REDIRECT_URI: _AUTH_REDIRECT_URI,
            AUTH_ENDPOINT: _AUTH_ENDPOINT,
            GRAPH_API_ENDPOINT: _GRAPH_API_ENDPOINT,
            OLD_MODIFIED_SINCE: _OLD_MODIFIED_SINCE,
            ACCESS_SCOPE: _ACCESS_SCOPE
        };
    });

    WinJS.Namespace.define('Config', {
        ACCESS_API: getAccessAPI()
    });
})();
