
angular.module('mwFormBuilder').factory("FormCodeBuilderId", function(){
    var id = 0;
        return {
            next: function(){
                return ++id;
            }
        }
    })

    .directive('mwFormCodeBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormPageElementBuilder',
        scope: {
            code: '=',
            formObject: '=',
            onReady: '&',
            isPreview: '=?',
            readOnly: '=?'
        },
        templateUrl: '/mw-form-code-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout,FormCodeBuilderId, mwFormBuilderOptions){
            var ctrl = this;


            // Put initialization logic inside `$onInit()`
            // to make sure bindings have been initialized.
            ctrl.$onInit = function() {
                ctrl.id = FormCodeBuilderId.next();
                ctrl.formSubmitted=false;
            };

            ctrl.save=function(){
                ctrl.formSubmitted=true;
                if(ctrl.form.$valid){
                    ctrl.onReady();
                }

            };


            // Prior to v1.5, we need to call `$onInit()` manually.
            // (Bindings will always be pre-assigned in these versions.)
            if (angular.version.major === 1 && angular.version.minor < 5) {
                ctrl.$onInit();
            }

        },
        link: function (scope, ele, attrs, formPageElementBuilder){
            var ctrl = scope.ctrl;
            ctrl.possiblePageFlow = formPageElementBuilder.possiblePageFlow;
            ctrl.options = formPageElementBuilder.options;
        }
    };
});
