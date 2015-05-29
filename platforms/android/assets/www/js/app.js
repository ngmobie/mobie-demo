var messages = [];
var findName = faker.name.findName;
var namePrefix = faker.name.prefix;
for(var i=0; i<400; i++) {
	messages.unshift({
		name: namePrefix() + ' ' + findName(),
		id: i,
		body: faker.lorem.sentence(10)
	});
}

function AppController ($scope, $mbSidenav) {
	$scope.toggleSidenav = function () {
		return $mbSidenav('sidenav-left').toggle();
	};
}

function MessagesController ($scope) {
	$scope.messages = messages;
}

angular.module('mobie-demo-app',['mobie','ngAnimate','ui.router'])
.factory('$pfBar', function (Helpers) {
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
})
.directive('closeSidenav', function (Helpers) {
	return {
		require: '?^mbSidenav',
		link: function (scope, element, attrs, mbSidenav) {
			if(!mbSidenav) {
				return;
			}

			element.on('click', function () {
				mbSidenav.component.hide();
			});
		}
	};
})
.controller('BarController', function ($pfBar, $scope) {
	$scope.$watch(function () {
		return $pfBar.getTitle();
	}, function (barTitle) {
		$scope.title = barTitle;
	});
})
.directive('title', function ($pfBar) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			attrs.$observe('title', function (barTitle) {
				$pfBar.setTitle(barTitle)
			});
		}
	};
})
.config(['$stateProvider',function ($stateProvider, $urlRouterProvider) {
	//$urlRouterProvider.otherwise('/app/index');
	$stateProvider
	.state('app', {
		url: '/app',
		templateUrl: 'js/app.html',
		controller: AppController,
		controllreAs: 'appCtrl'
	})
	.state('app.index', {
		url: '/index',
		templateUrl: 'js/app-index.html'
	})
	.state('app.messages', {
		url: '/messages',
		templateUrl: 'js/app-messages.html',
		controller: MessagesController
	});
}]);