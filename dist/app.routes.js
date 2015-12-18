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
    configureRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0lBQ1Q7O0lBRUEsUUFBUSxPQUFPLE9BQU8sT0FBTzs7SUFFN0IsU0FBUyxnQkFBZ0IsZ0JBQWdCLG9CQUFvQjtRQUN6RCxRQUFRLElBQUk7O1FBRVosbUJBQW1CLFVBQVU7O1FBRTdCOzthQUVLLE1BQU0sT0FBTztnQkFDVixhQUFhO2dCQUNiLFVBQVU7OzthQUdiLE1BQU0sZUFBZTtnQkFDbEIsS0FBSztnQkFDTCxPQUFPO29CQUNILGVBQWU7d0JBQ1gsYUFBYTt3QkFDYixZQUFZOzs7Ozs7S0FLL0IiLCJmaWxlIjoiYXBwLnJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpLmNvbmZpZyhjb25maWd1cmVSb3V0ZXMpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZ3VyZVJvdXRlcygkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ21vdW50aW5nIHJvdXRlcyBvbiAkc3RhdGVQcm92aWRlcicpO1xyXG5cclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcblxyXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcblxyXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGF5b3V0L3NoZWxsL3NoZWxsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWVcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmRlZmF1bHQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2hvbWUvaG9tZS5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
