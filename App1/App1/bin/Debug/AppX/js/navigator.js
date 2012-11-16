(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var displayProps = Windows.Graphics.Display.DisplayProperties;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    WinJS.Namespace.define("Application", {
        PageControlNavigator: WinJS.Class.define(
            // PageControlNavigator のコンストラクター関数を定義します。
            function PageControlNavigator(element, options) {
                this.element = element || document.createElement("div");
                this.element.appendChild(this._createPageElement());

                this.home = options.home;
                this.lastViewstate = appView.value;

                nav.onnavigated = this._navigated.bind(this);
                window.onresize = this._resized.bind(this);

                document.body.onkeyup = this._keyupHandler.bind(this);
                document.body.onkeypress = this._keypressHandler.bind(this);
                document.body.onmspointerup = this._mspointerupHandler.bind(this);

                Application.navigator = this;
            }, {
                /// <field domElement="true" />
                element: null,
                home: "",
                lastViewstate: 0,

                // この関数は、ページごとに新しいコンテナーを作成します。
                _createPageElement: function () {
                    var element = document.createElement("div");
                    element.style.width = "100%";
                    element.style.height = "100%";
                    return element;
                },

                // この関数はキーを押す操作に対応し、他の場所で BackSpace キーが
                // 使用されていないときにのみナビゲーションを行います。
                _keypressHandler: function (args) {
                    if (args.key === "Backspace") {
                        nav.back();
                    }
                },

                // この関数はキーを離す操作に対応し、キーボード ナビゲーションを有効にします。
                _keyupHandler: function (args) {
                    if ((args.key === "Left" && args.altKey) || (args.key === "BrowserBack")) {
                        nav.back();
                    } else if ((args.key === "Right" && args.altKey) || (args.key === "BrowserForward")) {
                        nav.forward();
                    }
                },

                _mspointerupHandler: function (args) {
                    if (args.button === 3) {
                        nav.back();
                    } else if (args.button === 4) {
                        nav.forward();
                    }
                },

                // この関数は、新しいページを DOM に追加してナビゲーションに
                // 対応します。
                _navigated: function (args) {
                    var that = this;
                    var oldElement = that.pageElement;
                    var newElement = that._createPageElement();
                    var parentedComplete;
                    var parented = new WinJS.Promise(function (c) { parentedComplete = c; });

                    args.detail.setPromise(
                        WinJS.Promise.timeout().then(function () {
                            if (oldElement.winControl && oldElement.winControl.unload) {
                                oldElement.winControl.unload();
                            }
                            return WinJS.UI.Pages.render(args.detail.location, newElement, args.detail.state, parented);
                        }).then(function parentElement(control) {
                            that.element.appendChild(newElement);
                            that.element.removeChild(oldElement);
                            oldElement.innerText = "";
                            that.navigated();
                            parentedComplete();
                        })
                    );
                },

                _resized: function (args) {
                    if (this.pageControl && this.pageControl.updateLayout) {
                        this.pageControl.updateLayout.call(this.pageControl, this.pageElement, appView.value, this.lastViewstate);
                    }
                    this.lastViewstate = appView.value;
                },

                // この関数は、ナビゲーションの完了時にアプリケーション コントロールを
                // 更新します。
                navigated: function () {
                    // ここでアプリケーション固有のナビゲーション時作業を実行します
                    var backButton = this.pageElement.querySelector("header[role=banner] .win-backbutton");
                    if (backButton) {
                        backButton.onclick = function () { nav.back(); };

                        if (nav.canGoBack) {
                            backButton.removeAttribute("disabled");
                        } else {
                            backButton.setAttribute("disabled", "disabled");
                        }
                    }
                },

                // これは PageControlNavigator オブジェクトです。
                pageControl: {
                    get: function () { return this.pageElement && this.pageElement.winControl; }
                },

                // これは現在のページのルート要素です。
                pageElement: {
                    get: function () { return this.element.firstElementChild; }
                }
            }
        )
    });
})();
