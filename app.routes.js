(function () {
    'use strict';

    angular.module('app').config(configureRoutes);

    function configureRoutes($stateProvider, $urlRouterProvider) {
        console.log('mounting routes on $stateProvider');

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('app', {
                templateUrl: 'layout/shell/shell.html',
                abstract: true
            })

            .state('app.default', {
                url: '/',
                views: {
                    'content@app': {
                        templateUrl: 'features/home/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
    }
})();