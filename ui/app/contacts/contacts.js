'use strict';

angular.module('myApp.contacts', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/contacts', {
            templateUrl: 'contacts/contacts.html',
            controller: 'ContactsCtrl',
            requireAuth: true
        });
    }])

    .controller('ContactsCtrl', ['$scope', '$http', '$timeout', 'RestService', function($scope, $http, $timeout, RestService) {

        var getContacts = function () {
            RestService.getContacts().then(function(data){
                $scope.contacts = RestService.contacts;
                $timeout(function() {
                    // anything you want can go here and will safely be run on the next digest.
                    $scope.$apply()
                })});
        };

        var deleteContacts = function (contacts) {
            var contactIdArray = [];
            angular.forEach(contacts, function(value, key) {
                contactIdArray.push(value.uid);
            });
            RestService.deleteContacts(contactIdArray)
                .then(function (data) {
                    getContacts();
                })
                .catch(function (data) {
                    $scope.contactError = data;
                });
        };

        var rowSelected = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                $scope.newContact = row.entity;
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {
                $scope.countRows = $scope.gridApi.selection.getSelectedRows().length;
            });
        };

        $scope.addContact = function() {
            $scope.contactError = '';
            if ( $scope.newContact.email.trim() === '' ||
                $scope.newContact.firstName.trim() === '' ||
                $scope.newContact.lastName.trim() === ''){
                $scope.contactError = 'First name, Last name, and Email fields are Mandatory.';
            } else {
                RestService.addContact($scope.newContact)
                    .then(function (data) {
                        $scope.contacts.push(data);
                        //reset form on screen
                        $scope.reset();
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.$apply()
                        });
                    })
                    .catch(function (data) {
                        $scope.contactError = data;
                    });
            }
        };

        $scope.updateContact = function() {
            $scope.contactError = '';
            if ( $scope.newContact.email.trim() === '' ||
                $scope.newContact.firstName.trim() === '' ||
                $scope.newContact.lastName.trim() === ''){
                $scope.contactError = 'First name, Last name, and Email fields are Mandatory.';
            } else {
                RestService.updateContact($scope.newContact)
                    .then(function (data) {
                        getContacts();
                        //reset form on screen
                        $scope.reset();
                        $timeout(function() {
                            // anything you want can go here and will safely be run on the next digest.
                            $scope.$apply()
                        });
                    })
                    .catch(function (data) {
                        $scope.contactError = data;
                    });
            }
        };

        $scope.reset = function() {
            $scope.contactError = '';
            $scope.newContact = $scope.initContact();
            angular.element('.firstName').trigger('focus');
        };

        $scope.initContact = function() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            }
        };

        $scope.deleteSelected = function () {
            if(confirm('Delete selected contacts?')){
                deleteContacts($scope.gridApi.selection.getSelectedRows());
            }
        };
        $scope.clearSelected = function () {
            $scope.gridApi.selection.clearSelectedRows();
        };

        $scope.$watch('RestService.contacts', function(){
            $scope.contacts = RestService.contacts;
            $timeout(function() {
                // anything you want can go here and will safely be run on the next digest.
                $scope.$apply();
            });
        });


        /* Main starts here... */

        $scope.title = 'Contacts';
//        $scope.studentError = '';
        $scope.newContact = $scope.initContact();
        $scope.contacts = RestService.contacts;
        $scope.updatePassword = false;
        angular.element('.firstName').trigger('focus');

        $scope.gridOptions = {
            data : 'contacts',
            enableRowSelection: true,
            enableFullRowSelection: true,
            enableRowHeaderSelection: true,  //set to false if we do not want the checkbox column
            onRegisterApi: rowSelected,
            columnDefs: [
                { field: 'firstName', displayName: 'First Name', width: "*", resizable: false},
                { field: 'lastName', displayName: 'Last Name', width: "20%" },
                { field: 'email', displayName: 'Email', width: "**"}]
        };

        RestService.getContacts().then(function(data){
            $scope.contacts = RestService.contacts;
            $timeout(function() {
                // anything you want can go here and will safely be run on the next digest.
                $scope.$apply()
            })});

    }]);