"use strict";


angular.module('app.layout', ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
        .state('app', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/layout.tpl.html',
                    controller: function ($rootScope, $stateParams, $state, i18nService) {
                        i18nService.setCurrentLang('zh-tw');
                    }
                }
            }
        })

        .state('app.default', {
            url: '/',
            data: {
                title: ''
            },
            views: {
                "content@app" : {
                    templateUrl: 'app/Template/views/default.html'
                }
            }
        });

    $urlRouterProvider.otherwise('/');

})

