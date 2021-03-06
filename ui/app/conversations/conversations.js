'use strict';

angular.module('myApp.conversations', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/conversations', {
            templateUrl: 'conversations/conversations.html',
            controller: 'ConversationsCtrl',
            requireAuth: true
        });
    }])

    .controller('ConversationsCtrl', ['$scope', '$http', '$timeout', 'RestService', function($scope, $http, $timeout, RestService) {

        var rowSelected = function (gridApi) {
console.log('Need to display conversation');
$scope.conversation = {
    messages: [
        {contactId: '3bf60ebf-3c3a-4a3f-8be0-d7feb202df75', initials: 'CW', text: 'Can you see this?'},
        {contactId: '2', initials: 'MJ', text: 'Yes'},
        {contactId: '3bf60ebf-3c3a-4a3f-8be0-d7feb202df75', initials: 'CW', text: 'How about now?'}
    ]
};
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                $scope.newConversation = row.entity;
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {
                $scope.countRows = $scope.gridApi.selection.getSelectedRows().length;
            });
        };

        var getConversations = function () {
            //reload conversations from the server
            RestService.getConversations().then(function(data){
                $scope.conversations = RestService.conversations;
                $timeout(function() {
                    // anything you want can go here and will safely be run on the next digest.
                    $scope.$apply()
                })});
        };

        var deleteConversations = function (conversations) {
            var conversationIdArray = [];
            angular.forEach(conversations, function(value, key) {
                conversationIdArray.push(value.uid);
            });
            RestService.deleteConversations(conversationIdArray)
                .then(function (data) {
                    getConversations();
                })
                .catch(function (data) {
                    $scope.conversationError = data;
                });
        };

        $scope.initConversation = function() {
            return {
                subject: '',
                recipients: RestService.contacts,
                lastUpdated: 'need_last_updated_to_be_now',
                messages: []
            }
        };

        $scope.reset = function() {
            $scope.conversationError = '';
            $scope.newConversation = $scope.initConversation();
            angular.element('.firstName').trigger('focus');
        };

        $scope.deleteSelected = function () {
            if(confirm('Delete selected conversations?')){
                deleteConversations($scope.gridApi.selection.getSelectedRows());
            }
        };
        $scope.clearSelected = function () {
            $scope.gridApi.selection.clearSelectedRows();
        };

        $scope.$watch('RestService.conversations', function(){
            $scope.conversations = RestService.conversations;
            $timeout(function() {
                // anything you want can go here and will safely be run on the next digest.
                $scope.$apply();
            });
        });


        /* Main starts here... */

        $scope.title = 'Conversations';
//        $scope.user = RestService.user;
        $scope.newConversation = $scope.initConversation();
        $scope.conversations = RestService.conversations;
        angular.element('.firstName').trigger('focus');

        $scope.gridOptions = {
            data : 'conversations',
            enableRowSelection: true,
            enableFullRowSelection: true,
            enableRowHeaderSelection: true,  //set to false if we do not want the checkbox column
            onRegisterApi: rowSelected,
            columnDefs: [
                { field: 'subject', displayName: 'Subject', width: "*", resizable: false},
                { field: 'lastUpdated', displayName: 'Last Updated', width: "20%" },
                { field: 'recipients', displayName: 'Recipients', width: "**"}
            ]
        };

        RestService.getConversations().then(function(data){
            $scope.conversations = RestService.conversations;
            $timeout(function() {
                // anything you want can go here and will safely be run on the next digest.
                $scope.$apply()
            })});

    }]);