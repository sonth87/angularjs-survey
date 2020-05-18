
angular.module('mwFormBuilder').directive('mwFormList', function ($rootScope) {

    return {
        replace: true,
        restrict: 'AE',
        scope: {
            listSurvey: '=?',
        },
        templateUrl: '/mw-form-list.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function ($scope, mwFormUuid, MW_QUESTION_TYPES) {
            var ctrl = this;

            ctrl.$onInit = function () {
            };

            ctrl.editSurvey = function (survey) {
                $scope.$parent.ctrl.formData = Object.assign({}, survey);
                $scope.$parent.ctrl.builderMode = true;
            }

            ctrl.addNewSurvey = function () {
                $scope.$parent.ctrl.formData = {};
                $scope.$parent.ctrl.builderMode = true;
            }

            ctrl.updateStatus = function (index, survey) {
                $scope.$parent.ctrl.listSurvey[index].status = survey.status;
            }

            if (angular.version.major === 1 && angular.version.minor < 5) {
                this.$onInit();
            }
        },
    };
});