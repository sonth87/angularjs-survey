
angular.module('mwFormViewer').factory("FormCodeId", function () {
    var id = 0;
    return {
        next: function () {
            return ++id;
        }
    }
})
    .directive('mwFormCode', function () {

        return {
            replace: true,
            restrict: 'AE',
            require: '^mwFormViewer',
            scope: {
                code: '=?',
                options: '=?',
            },
            templateUrl: '/mw-form-code.html',
            controllerAs: 'ctrl',
            bindToController: true,
            controller: function ($timeout, FormCodeId) {
                var ctrl = this;

                // Put initialization logic inside `$onInit()`
                // to make sure bindings have been initialized.
                this.$onInit = function () {
                    ctrl.id = FormCodeId.next();

                    const url = window.location;
                    var query = url.search.substring(1);
                    var vars = query.split('&');
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split('=');
                        if(pair[0] === ctrl.code.text) {
                            ctrl.code.response = decodeURIComponent(pair[1]);
                        }
                    }
                };

                // Prior to v1.5, we need to call `$onInit()` manually.
                // (Bindings will always be pre-assigned in these versions.)
                if (angular.version.major === 1 && angular.version.minor < 5) {
                    this.$onInit();
                }

            },
            link: function (scope, ele, attrs, mwFormViewer) {
                var ctrl = scope.ctrl;
                ctrl.print = mwFormViewer.print;
            }
        };
    });
