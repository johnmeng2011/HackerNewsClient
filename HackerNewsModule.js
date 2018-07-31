/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function getFormattedContent(contents){
    var value="";
    for(var i=0; i < contents.length; i++){
        var content = contents[i];
        value += ('<p>'+ (i+1) + '. Title: '+ content.title+ '</p>');
        value += ('<p>Author: ' + content.author + '</p>');
        value += '<p>Created At: ' + content.created_at +'</p>';
        value += '<p>Story:';
        if(content.story_text!=null) 
            value = value + content.story_text;
        value += '</p><hr>';
    }
    return value;
}

var app = angular.module('hackerNewsClient',['ngSanitize']);

app.controller('hackerNewsController', function($scope, $http) {
    $scope.showLabel = false;
    $scope.backwardDisable = true;
    $scope.forwardDisable = true;
	$scope.showSpin = false;

    $scope.doSearch = function(){
        $scope.showLabel= false;
        $scope.showSpin = true;
        $http.get("https://hn.algolia.com/api/v1/search?query="+$scope.storyName+"&tags=story")
        .then(function(response) {
            $scope.processData(response);
            if($scope.page < $scope.nPage-1) $scope.forwardDisable = false;
			$scope.showSpin = false;
            
        });
    };

    $scope.goback= function(){
        $scope.backwardDisable = true;
        $scope.forwardDisable = true;
		$scope.showSpin = true;
        $http.get("https://hn.algolia.com/api/v1/search?query="+$scope.storyName+"&tags=story&page="+($scope.page-1))
        .then(function(response) {
			$scope.processData(response);
			if($scope.page >0) $scope.backwardDisable = false;
            if($scope.page < $scope.nPage - 1) $scope.forwardDisable = false;
			$scope.showSpin = false;
        }, function(error){
			if($scope.page >0) $scope.backwardDisable = false;
            if($scope.page < $scope.nPage - 1) $scope.forwardDisable = false;
			$scope.showSpin = false;
		});
    };

    $scope.goahead= function(){
        $scope.backwardDisable = true;
        $scope.forwardDisable = true;
		$scope.showSpin = true;
        $http.get("https://hn.algolia.com/api/v1/search?query="+$scope.storyName+"&tags=story&page="+($scope.page+1))
        .then(function(response) {
            $scope.processData(response);
            if($scope.page < $scope.nPage-1) $scope.forwardDisable = false;
            if($scope.page > 0 ) $scope.backwardDisable = false;
			$scope.showSpin = false;
        }, function(error){
			if($scope.page < $scope.nPage-1) $scope.forwardDisable = false;
            if($scope.page > 0 ) $scope.backwardDisable = false;
			$scope.showSpin = false;
		});
    };

    $scope.processData= function(response){
        var data = response.data;
        $scope.nPage = data.nbPages;
        $scope.page = data.page;
        $scope.showLabel = true;
        var hits = data.hits;
        $scope.storyContent = getFormattedContent(hits);
    }
});


app.directive('searchEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.searchEnter);
                });
                event.preventDefault();
            }
        });
    };
});

