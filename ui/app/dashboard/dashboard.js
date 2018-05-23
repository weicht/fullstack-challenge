'use strict';

angular.module('myApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])

    .controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$timeout', 'RestService',
        function($scope, $rootScope, $http, $timeout, RestService) {
            $scope.username = '';
            $scope.password = '';
            $scope.loginError = '';

//             $scope.login = function() {
//                 $scope.loginError = '';
//                 RestService.authenticate($scope.username.trim(), $scope.password.trim())
//                     .then(function (data) {
//                         $scope.user = data.data;
//                         $rootScope.$emit("loginSuccessful", $scope.user);
// //                        OatRestService.setUser($scope.user);
//                         localStorage.setItem('oatUser', JSON.stringify($scope.user));
//                     })
//                     .catch(function (data) {
//                         $scope.loginError = data;
//                     });
//             };
        }]);