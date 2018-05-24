'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    // .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$timeout', 'OatRestService',
    //     function($scope, $rootScope, $http, $timeout, OatRestService) {
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$timeout', 'RestService',
        function($scope, $rootScope, $http, $timeout, RestService) {
            $scope.username = '';
            $scope.password = '';
            $scope.loginError = '';

            $scope.login = function() {
                $scope.loginError = '';
                RestService.authenticate($scope.username.trim(), $scope.password.trim())
                    .then(function (data) {
                        $scope.user = data.data;
                        $rootScope.$emit("loginSuccessful", $scope.user);
                        RestService.setUser($scope.user);
                        localStorage.setItem('g3User', JSON.stringify($scope.user));
                    })
                    .catch(function (data) {
                        $scope.loginError = data;
                    });
            };
        }]);