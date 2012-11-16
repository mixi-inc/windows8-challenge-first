(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/detail.html", {

        ready: function (element, options) {
            var data = options.data;

            $('#JS_image').attr('src', data.largeSrc);
            $('#JS_title').text(data.title);
            $('#JS_timestamp').text(data.created);
            $('#JS_url').text(data.url).attr('href', data.url);
        }
    });
})();
