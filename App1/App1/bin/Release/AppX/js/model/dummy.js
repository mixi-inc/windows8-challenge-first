(function () {
    "use strict";

    /**
     * ListView用のダミーデータを返します
     *
     * @name get
     * @param なし
     * @return {Array} ListView用のダミーデータ
     */
    function get() {
        return [
            { title: "Cliff", src: "images/Cliff.jpg" },
            { title: "Grapes", src: "images/Grapes.jpg" },
            { title: "Rainier", src: "images/Rainier.jpg" },
            { title: "Sunset", src: "images/Sunset.jpg" },
            { title: "Valley", src: "images/Valley.jpg" }
        ];
    }

    WinJS.Namespace.define("DummyModel", {
        get: get
    });
})();
