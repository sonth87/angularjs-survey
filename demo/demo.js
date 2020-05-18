angular.module('app', ['ui.bootstrap', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic'])
    .config(function($translateProvider){
        $translateProvider.useStaticFilesLoader({
            prefix: '../dist/i18n/',
            suffix: '/angular-surveys.json'
        });
        $translateProvider.preferredLanguage('en');
    })
    .controller('DemoController', function($q,$http, $translate, mwFormResponseUtils, $rootScope) {

        var ctrl = this;
        ctrl.mergeFormWithResponse = true;
        ctrl.cgetQuestionWithResponseList = true;
        ctrl.cgetResponseSheetHeaders = true;
        ctrl.cgetResponseSheetRow = true;
        ctrl.cgetResponseSheet = true;
        ctrl.headersWithQuestionNumber = true;
        ctrl.builderReadOnly = false;
        ctrl.viewerReadOnly = false;
        ctrl.languages = ['en', 'pl', "es", "ru"];
        ctrl.formData = null;
        $http.get('form-data.json')
            .then(function(res){
                ctrl.formData = res.data;
            });
        ctrl.formBuilder={};
        ctrl.formViewer = {};
        ctrl.formOptions = {
            autoStart: false,
            disableSubmit: false
        };
        ctrl.selectedTabIndex=0;
        ctrl.optionsBuilder={
            /*elementButtons:   [{title: 'My title tooltip', icon: 'fa fa-database', text: '', callback: ctrl.callback, filter: ctrl.filter, showInOpen: true}],
            customQuestionSelects:  [
                {key:"category", label: 'Category', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}], required: false},
                {key:"category2", label: 'Category2', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}]}
            ],
            elementTypes: ['question', 'image'],
            pagesSize: [1,10,25,50,100],
            pageSize: 1 */
        };
        ctrl.formStatus= {};
        ctrl.responseData={};
        $http.get('response-data.json')
            .then(function(res){
                ctrl.responseData = res.data;
            });
            
        $http.get('template-data.json')
            .then(function(res){
                ctrl.templateData = res.data;
            });

        ctrl.showResponseRata=false;
        ctrl.saveResponse = function(){
            var d = $q.defer();
            var res = confirm("Response save success?");
            if(res){
                d.resolve(true);
            }else{
                d.reject();
            }
            return d.promise;
        };

        ctrl.onImageSelection = function (){

            var d = $q.defer();
            var src = prompt("Please enter image src");
            if(src !=null){
                d.resolve(src);
            }else{
                d.reject();
            }

            return d.promise;
        };

        ctrl.setSelectedTabIndex= function(index){
            ctrl.selectedTabIndex=index;
            if(index===1){
                ctrl.resetViewer();
            }
        };

        ctrl.resetViewer = function(){
            if(ctrl.formViewer.reset){
                ctrl.formViewer.reset();
            }

        };

        ctrl.resetBuilder= function(){
            if(ctrl.formBuilder.reset){
                ctrl.formBuilder.reset();
            }
        };

        ctrl.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };

        ctrl.getMerged=function(){
            return mwFormResponseUtils.mergeFormWithResponse(ctrl.formData, ctrl.responseData);
        };

        ctrl.getQuestionWithResponseList=function(){
            return mwFormResponseUtils.getQuestionWithResponseList(ctrl.formData, ctrl.responseData);
        };
        ctrl.getResponseSheetRow=function(){
            return mwFormResponseUtils.getResponseSheetRow(ctrl.formData, ctrl.responseData);
        };
        ctrl.getResponseSheetHeaders=function(){
            return mwFormResponseUtils.getResponseSheetHeaders(ctrl.formData, ctrl.headersWithQuestionNumber);
        };

        ctrl.getResponseSheet=function(){
            return mwFormResponseUtils.getResponseSheet(ctrl.formData, ctrl.responseData, ctrl.headersWithQuestionNumber);
        };

    });