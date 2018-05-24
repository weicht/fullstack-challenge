'use strict';

//angular.module('myApp.main', ['ngRoute', 'ngCookies'])
angular.module('myApp.main', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
    }])

    .controller('MainCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$uibModal', '$location', 'RestService', '$cookies',
        function($scope, $rootScope, $http, $timeout, $uibModal, $location, RestService, $cookies) {

            $scope.logout = function() {
                //Logout and redirect to Home page
                RestService.logout();
                $scope.user = {};
                localStorage.setItem('g3User', '');
                localStorage.setItem('g3JWT', '');
                $cookies.remove('g3JWT');
                $location.path("/login");
            };

            $scope.$on('$routeChangeStart', function(angularEvent, newUrl) {
                $scope.onLoginPage = $location.path() === '/login';
                if (newUrl.requireAuth && !$scope.user.username) {
                    // User isn’t authenticated
                    $location.path("/login");
                }
            });

            $rootScope.$on("loginSuccessful", function(event, user){
                $scope.user = user;
                RestService.setUser(user);
                init();
                $location.path("/conversations");
            });

            $scope.$watch('RestService.contacts', function(){
                console.log('contacts changed!');
                $timeout(function() {
                    // anything you want can go here and will safely be run on the next digest.
                    $scope.$apply();
                });
            });

            $scope.$watch('RestService.conversations', function(){
                console.log('conversations changed!');
                $timeout(function() {
                    // anything you want can go here and will safely be run on the next digest.
                    $scope.$apply();
                });
            });

            var init = function () {
                //TODO: fix later but while testing and reloading, it's not getting set
                if(!$scope.user){
                    var userFromStorage = localStorage.getItem('g3User');
                    if(userFromStorage && userFromStorage !== ""){
                        RestService.setUser(JSON.parse(userFromStorage));
                        $scope.user = RestService.user;
                    }
                    var jwtFromStorage = localStorage.getItem('g3JWT');
                    if(jwtFromStorage && jwtFromStorage !== ""){
                        RestService.setJWT(jwtFromStorage);
                    }
                }

                RestService.getContacts().then(function(data){
                    $timeout(function() {
                        $scope.contacts =  RestService.contacts;
                        // anything you want can go here and will safely be run on the next digest.
                        $scope.$apply()
                    })});

                RestService.getConversations().then(function(data){
                    $timeout(function() {
                        $scope.conversations =  RestService.conversations;
                        // anything you want can go here and will safely be run on the next digest.
                        $scope.$apply()
                    })});

            };



            /* Main starts here */
            init();

            if(!$scope.user){
                //try to get from localStorage
                var localUser = localStorage.getItem('g3User');
                if(localUser && localUser !== ""){
                    var currentUser = JSON.parse(localUser);
                    if(!currentUser){
                        $location.path("/login");
                    } else {
                        $scope.user = currentUser;
                    }
                }
            }
        }]);

