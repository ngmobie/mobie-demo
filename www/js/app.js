var messages = [];
var findName = faker.name.findName;
var namePrefix = faker.name.prefix;
for(var i=0; i<400; i++) {
	messages.unshift({
		author: {
			name: namePrefix() + ' ' + findName(),
		},
		id: i,
		body: faker.lorem.sentence(10)
	});
}

AppController.$inject = ['$scope', '$mbSidenav'];
function AppController ($scope, $mbSidenav) {
	$scope.toggleSidenav = function () {
		return $mbSidenav('sidenav-left').toggle();
	};
}

MessagesController.$inject = ['$scope'];
function MessagesController ($scope) {
	$scope.messages = messages;
}

$PfBarFactory.$inject = ['Helpers'];
function $PfBarFactory (Helpers) {
	var barTitle = '???';
	var $pfBar = {};
	$pfBar.getTitle = function () {
		return barTitle;
	};
	$pfBar.setTitle = function (newBarTitle) {
		Helpers.safeDigest(function () {
			barTitle = newBarTitle;
		});
	};
	return $pfBar;
}

BarController.$inject = ['$pfBar', '$scope'];
function BarController ($pfBar, $scope) {
	$scope.$watch(function () {
		return $pfBar.getTitle();
	}, function (barTitle) {
		$scope.title = barTitle;
	});
}

TitleDirective.$inject = ['$pfBar'];
function TitleDirective ($pfBar) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			attrs.$observe('title', function (barTitle) {
				$pfBar.setTitle(barTitle)
			});
		}
	};
}

angular.module('mobie-demo-app',[
	'ngAnimate',
	'mobie',
	'ui.router'
])
.factory('$pfBar', $PfBarFactory)
.controller('BarController', BarController)
.directive('title', TitleDirective)
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/app/index');
	$stateProvider
	.state('app', {
		url: '/app',
		templateUrl: 'js/app.html',
		controller: AppController,
		controllreAs: 'appCtrl'
	})
	.state('app.index', {
		url: '/index',
		templateUrl: 'js/app-index.html',
		controller: ['$scope', function ($scope) {
			$scope.indexText = faker.lorem.sentences(800);
		}]
	})
	.state('app.messages', {
		url: '/messages',
		templateUrl: 'js/app-messages.html',
		controller: MessagesController
	});
}]);