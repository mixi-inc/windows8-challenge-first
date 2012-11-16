(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/view.html", {

        ready: function (element, options) {
            var listView = itemList.winControl;

            WinJS.UI.setOptions(listView, {
                itemTemplate: simple_ItemTemplate,
                layout: new WinJS.UI.GridLayout()
            });

            PhotoModel.getAsync()
            .then(function (result) {
                var bindingList = new WinJS.Binding.List(result);
                listView.itemDataSource = bindingList.dataSource;
            });
        }
    });
})();
