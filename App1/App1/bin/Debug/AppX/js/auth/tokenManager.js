(function () {
    'use strict';

    var MOVEUP = 300;   // トークンのexpireを早める

    /**
     * Private
     */

    function _getUnixTime() {
        return parseInt((new Date()) / 1000, 10);
    }

    /**
     * トークン取得の際のcomplete処理を返す
     *
     * @name _onCompleteTokenRequest
     * @param _complete {Function} completeハンドラ
     * @retrun {Function} 実行処理
     */
    function _onCompleteTokenRequest(_complete) {
        return function (result) {
            var _json = JSON.parse(result.responseText);
            _json = _addExpireToToken(_json);
            _saveToken(_json);
            _complete(_json.access_token);
        };
    }

    /**
     * トークン新規取得を行う非同期リクエストを生成します
     *
     * @name _createNewTokenRequestAsync
     * @param code {String} Authorization Code
     * @return {WinJS.Promise} 処理のPromiseオブジェクト
     */
    function _createNewTokenRequestAsync(code) {
        return new WinJS.Promise(function (c, e, p) {
            _createTokenRequestAsync(_getParamNewTokenRequest(code))
                .then(_onCompleteTokenRequest(c), e);
        });
    }

    /**
     * トークン更新を行う非同期リクエストを生成します
     *
     * @name _createRefreshTokenRequestAsync
     * @param param {String} トークン更新に必要なパラメータ
     * @return {WinJS.Promise} 処理のPromiseオブジェクト
     */
    function _createRefreshTokenRequestAsync(refreshTokenParam) {
        //トークン取得中の場合はPromiseの後続処理をキューに積み処理をしない
        if (_isInProccess) {
            return _createAddWaitingQueueAsync();
        }

        _isInProccess = true;
        return new WinJS.Promise(function (c, e, p) {
            _createTokenRequestAsync(_getParamRefreshTokenRequest(refreshTokenParam))
                .then(_onCompleteTokenRequest(c),
                      _onErrorTokenRequest(e));
        });
    }

    /**
     * トークンに対して処理を行うエンドポイントへの非同期リクエストを生成します
     *
     * @name _createTokenRequestAsync
     * @param requestParam {String} リクエストに必要なパラメータ
     * @return {WinJS.Promise} 処理のPromiseオブジェクト
     */
    function _createTokenRequestAsync(requestParam) {
        return WinJS.xhr({
            type: "POST",
            url: Config.ACCESS_API.AUTH_ENDPOINT,
            headers: {
                "If-Modified-Since": Config.ACCESS_API.OLD_MODIFIED_SINCE,
                "Content-type": "application/x-www-form-urlencoded"
            },
            data: requestParam
        });
    }

    /**
     * トークン新規取得を行うためのパラメータを生成します
     *
     * @name _getParamNewTokenRequest
     * @param code {String} Authorization Code
     * @return {String} パラメータ文字列
     */
    function _getParamNewTokenRequest(code) {
        return "grant_type=authorization_code&client_id=" + encodeURIComponent(Config.ACCESS_API.CLIENT_ID) +
                "&client_secret=" + encodeURIComponent(Config.ACCESS_API.CLIENT_SECRET) +
                "&code=" + code +
                "&redirect_uri=" + encodeURIComponent(Config.ACCESS_API.AUTH_REDIRECT_URI);
    }

    /**
     * トークン更新を行うためのパラメータを生成します
     *
     * @name _getParamRefreshTokenRequest
     * @param refreshTokenParam {String} トークン更新に必要なパラメータ
     * @return {String} パラメータ文字列
     */
    function _getParamRefreshTokenRequest(refreshTokenParam) {
        return encodeURI("grant_type=refresh_token&client_id=" + Config.ACCESS_API.CLIENT_ID +
                         "&client_secret=" + Config.ACCESS_API.CLIENT_SECRET +
                        "&refresh_token=" + refreshTokenParam);
    }

    /**
   　 * トークンにExpireを追加します
 　   *
  　  * @name _addExpireToToken
 　   * @param token {Object} トークン（JSON）
 　   * @return {Object} Expire情報が追加されたトークン（JSON）
 　   */
    function _addExpireToToken(token) {
        token.expireTime = token.expires_in - MOVEUP + _getUnixTime();
        return token;
    }

    /**
     * トークンが有効かどうかを判別します
     *
     * @name _isValidToken
     * @param token {Object} トークン（JSON）
     * @return {Boolean} 有効ならtrue、それ以外ならfalse
     */
    function _isValidToken(token) {
        //トークンのExpireが現在時刻を超えていないかどうか
        return (_getUnixTime() < token.expireTime);
    }

    /**
     * トークンをストレージに保存します
     *
     * @name _saveToken
     * @param json {Object} トークン（JSON）
     */
    function _saveToken(json) {
        Windows.Storage.ApplicationData.current.localSettings.values[Config.STORAGE_KEY.ACCESS_TOKEN] = JSON.stringify(json);
    }

    /**
     * 保存したトークンを返します
     *
     * @name _loadToken
     * @return {Object} トークン（JSON）、ない場合はnull
     */
    function _loadToken() {
        var _jsonString = Windows.Storage.ApplicationData.current.localSettings.values[Config.STORAGE_KEY.ACCESS_TOKEN];
        if (!_jsonString) return null;

        return JSON.parse(_jsonString);
    }

    /**
     * Public
     */

    /**
     * トークンを返す非同期リクエストを生成します
     * トークンの状態によって、自動的に処理が切り替わります
     *
     * @name getTokenAsync
     * @param param {Object} メールアドレスとパスワードが格納されたオブジェクト（新規取得の場合のみ必要）
     * @return {WinJS.Promise} 処理のPromiseオブジェクト
     */
    function getTokenAsync(param) {
        var _token = _loadToken();

        //トークンがない場合、トークン新規取得のリクエストを送る
        if (!_token) {
            return _createNewTokenRequestAsync(param);
        }
        //トークンの有効期限が切れている場合、トークン更新のリクエストを送る
        if (!_isValidToken(_token)) {
            return _createRefreshTokenRequestAsync(_token.refresh_token);
        }
        //トークンが有効な場合はアクセストークンを渡す
        return new WinJS.Promise.wrap(_token.access_token);
    }

    /**
     * 有効なトークンが保存されているか確認します
     *
     * @name isSavedToken
     * @return {Boolean} 有効ならtrue、それ以外ならfalse
     */
    function isSavedToken() {
        var _token = _loadToken();
        return !(_.isNull(_token));
    }

    WinJS.Namespace.define('TokenManager', {
        getTokenAsync: getTokenAsync,
        isSavedToken: isSavedToken
    });
})();