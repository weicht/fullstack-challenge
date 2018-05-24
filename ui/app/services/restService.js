'use strict';

angular.module('myApp.restService', ['ngCookies'])
    .service('RestService', ['$http', '$window', '$timeout', '$cookies',
        function ($http, $window, $timeout, $cookies) {
            var BACKEND_BASE_URL  = 'http://localhost:4000';
            var FRONTEND_BASE_URL = 'http://localhost:8000';

            var parseJwt = function(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse($window.atob(base64));
            };

            var sortByName = function(a, b){
                var nameA = a.lastName.toUpperCase();
                var nameB = b.lastName.toUpperCase();

                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            };

            var Service = function (){};
            Service.jwt = '';
            Service.bearer = '';
            Service.contacts = [];
            Service.conversations = [];
            Service.user = {};

            Service.setUser = function (user) {
                this.user = user;
            };

            Service.setJWT = function (jwt) {
                this.jwt = jwt;
                this.bearer = 'Bearer '+this.jwt;
                $http.defaults.headers.common['Authorization'] = this.bearer;
            };

            Service.authenticate = function (username, password) {
                var self = this;
                return $http.post(BACKEND_BASE_URL+'/authenticate', {username: username, password: password})
                    .then(function (response) {
                        if (response.data.error) {
                            console.log('Authentication failed: '+response.data.error);
                            throw response.data.error
                        } else {
                            self.jwt = response.data.token;
                            self.bearer = 'Bearer '+self.jwt;
                            $http.defaults.headers.common['Authorization'] = self.bearer;
                            localStorage.setItem('g3JWT', self.jwt);
//                            $cookies.put('oatJWT', self.jwt);
                            //return the payload out of the jwt
                            return parseJwt(self.jwt);
                        }
                    });
            };

            Service.logout = function () {
                var self = this;
                self.jwt = '';
                self.bearer = '';
                $http.defaults.headers.common['Authorization'] = '';
                localStorage.setItem('g3JWT', self.jwt);
//                $cookies.remove('oatJWT');
            };

            Service.getContacts = function () {
                var self = this;
                return $http.get(BACKEND_BASE_URL+'/contact')
                    .then(function (response) {
                        response.data.sort( sortByName );
                        self.contacts = _.clone(response.data);
                        return response.data;
                    });
            };

            Service.addContact = function (contact) {
                var self = this;
                return $http.post(BACKEND_BASE_URL+'/contact', contact)
                    .then(function (response) {
                        //success
                        return response.data;
                    })
                    .catch(function(response) {
                        //error
                        console.error('Add contact API error', response.status, response.data);
                        throw('Add contact error: '+response.data);
                    });
            };

            Service.updateContact = function (contact) {
                return $http.put(BACKEND_BASE_URL+'/contact', contact)
                    .then(function (response) {
                        //success
                        return response.data;
                    })
                    .catch(function(response) {
                        //error
                        console.error('Update contact API error', response.status, response.data);
                        throw('Update contact error: '+response.data);
                    });
            };

            Service.deleteContacts = function (contactIdArray){
                // use this long format of $http.delete so we can pass a body of contactIds along as payload
                return $http({
                    method: 'DELETE',
                    url: BACKEND_BASE_URL+'/contact',
                    data: contactIdArray,
                    headers: {'Content-Type': 'application/json;charset=utf-8'}
                }).then(function (response) {
                    return response.data;
                }).catch(function(response) {
                    //error
                    console.error('Delete contact API error', response.status, response.data);
                    throw('Failed to delete contact. Check for log error.');
                });
            };


            if (!Service.jwt){
                var self = this;
                //on page reload we may need to regrab the jwt
                var jwtFromStorage = localStorage.getItem('g3JWT');
                if(jwtFromStorage){
                    self.jwt = jwtFromStorage;
                    self.bearer = 'Bearer '+self.jwt;
                    $http.defaults.headers.common['Authorization'] = self.bearer;
                }
            }

            return Service;
        }]);
