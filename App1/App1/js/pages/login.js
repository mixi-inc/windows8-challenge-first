(function () {
    "use strict";

    var loginButton;

    var page = WinJS.UI.Pages.define("/html/login.html", {

        ready: function (element, options) {
            $('#JS_loginAction').bind('click', [], this.doLogin);
            $('#JS_doAuth').bind('click', [], this.doAuth);
        },

        doAuth: function () {
            var authUri = Config.ACCESS_API.AUTH_CODE_URI + '?client_id=' + encodeURIComponent(Config.ACCESS_API.CLIENT_ID)
                + '&response_type=code&scope=' + encodeURIComponent(Config.ACCESS_API.ACCESS_SCOPE);
            open(authUri);
        },

        doLogin: function () {
            var authCode = $('#JS_authCode').val();

            TokenManager.getTokenAsync(authCode)
            .then(function (result) {
                WinJS.Navigation.navigate('/html/view.html');
            })
            .then(null, function (e) {
                //ログイン失敗
            });
        },

        unload: function () {
            $('#JS_loginAction').unbind();
            $('#JS_doAuth').unbind();
        }
    });
})();
