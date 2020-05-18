var app = angular.module('app', ['ngMaterial', 'ngRoute', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic']);

app.config(["$routeProvider", "$locationProvider", "$translateProvider", function ($routeProvider, $locationProvider, $translateProvider) {
    // $locationProvider.html5Mode(true);
    // $routeProvider
    //     .when('/builder', {
    //         templateUrl: "/demo.html",
    //         controller: 'AppController'
    //     })
    //     .when("/abc", {
    //         templateUrl: "/demo-viewer.html",
    //         controller: 'AppController'
    //     });

    $translateProvider.useStaticFilesLoader({
        prefix: '../dist/i18n/',
        suffix: '/angular-surveys.json'
    });
    $translateProvider.preferredLanguage('en');
}]);

app.controller('AppController', function ($scope, $q, $http, $translate, mwFormResponseUtils) {
    var ctrl = this;
    ctrl.cmergeFormWithResponse = false;
    ctrl.cgetQuestionWithResponseList = false;
    ctrl.cgetResponseSheetHeaders = false;
    ctrl.cgetResponseSheetRow = false;
    ctrl.cgetResponseSheet = false;
    ctrl.headersWithQuestionNumber = true;
    ctrl.builderReadOnly = false;
    ctrl.viewerReadOnly = false;
    ctrl.languages = ['en', 'pl', "es", 'ru'];
    ctrl.formData = null;
    ctrl.listSurvey = [];
    ctrl.status = true;
    setTimeout(function () {
        $http.get('list-survey.json')
            .then(function (res) {
                ctrl.listSurvey = res.data;
            });
    }, 1000);

    // setTimeout(function () {
        $http.get('form-data.json')
            .then(function (res) {
                ctrl.formData = res.data;
                ctrl.status = res.data.status === 'active' ? true : false;
            });
    // }, 2000);

    ctrl.selectedTabIndex = 0;
    ctrl.formBuilder = {};
    ctrl.formViewer = {};
    ctrl.formOptions = {
        autoStart: true,
        disableSubmit: false,
        isOpen: true
    };
    ctrl.optionsBuilder = {
        /*elementButtons:   [{title: 'My title tooltip', icon: 'fa fa-database', text: '', callback: ctrl.callback, filter: ctrl.filter, showInOpen: true}],
        customQuestionSelects:  [
            {key:"category", label: 'Category', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}], required: false},
            {key:"category2", label: 'Category2', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}]}
        ],
        elementTypes: ['question', 'image'],
        pagesSize: [1,10,25,50,100],
        pageSize: 1      
             */
    };
    ctrl.formStatus = {};
    ctrl.responseData = {};
    setTimeout(function () {
    $http.get('response-data.json')
        .then(function (res) {
            ctrl.responseData = res.data || {};
        });
    }, 2000);

    $http.get('template-data.json')
        .then(function (res) {
            ctrl.templateData = res.data;
        });

    ctrl.showResponseRata = false;
    ctrl.saveResponse = function () {
        var d = $q.defer();
        var res = confirm("Response save success?");
        if (res) {
            d.resolve(true);
        } else {
            d.reject();
        }
        return d.promise;
    };

    ctrl.onImageSelection = function () {

        var d = $q.defer();
        var src = prompt("Please enter image src");
        if (src != null) {
            d.resolve(src);
        } else {
            d.reject();
        }

        return d.promise;
    };

    ctrl.resetViewer = function () {
        if (ctrl.formViewer.reset) {
            ctrl.formViewer.reset();
        }
    };

    ctrl.resetBuilder = function () {
        if (ctrl.formBuilder.reset) {
            ctrl.formBuilder.reset();
        }
    };
    
    ctrl.saveFormBuilder = function() {
        console.log(ctrl.formData)
    }

    $scope.$watch(function (scope) { return scope.ctrl.formData }, function (newValue, oldValue) {
        ctrl.selectedTabIndex = 1;
    });

    ctrl.changeLanguage = function (languageKey) {
        $translate.use(languageKey);
    };

    ctrl.getMerged = function () {
        return mwFormResponseUtils.mergeFormWithResponse(ctrl.formData, ctrl.responseData);
    };

    ctrl.getQuestionWithResponseList = function () {
        return mwFormResponseUtils.getQuestionWithResponseList(ctrl.formData, ctrl.responseData);
    };
    ctrl.getResponseSheetRow = function () {
        return mwFormResponseUtils.getResponseSheetRow(ctrl.formData, ctrl.responseData);
    };
    ctrl.getResponseSheetHeaders = function () {
        return mwFormResponseUtils.getResponseSheetHeaders(ctrl.formData, ctrl.headersWithQuestionNumber);
    };

    ctrl.getResponseSheet = function () {
        return mwFormResponseUtils.getResponseSheet(ctrl.formData, ctrl.responseData, ctrl.headersWithQuestionNumber);
    };

});

app.controller('LoginController', function ($scope, $mdDialog, $interval) {
    $scope.theme = 'red';

    var isThemeRed = true;

    $interval(function () {
        $scope.theme = isThemeRed ? 'blue' : 'red';

        isThemeRed = !isThemeRed;
    }, 2000);

    $scope.login = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
            .then(function (answer) {
                $scope.status = 'ok';
            }, function () {
                $scope.status = 'cancelled.';
            });
    };

    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }
});