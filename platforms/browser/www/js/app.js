var thumbnails = [
	'img/thumbnail1.jpg',
	'img/thumbnail2.jpg',
	'img/thumbnail3.jpg',
	'img/thumbnail4.jpg'
];
var avatars = [
	'img/avatar1.jpg',
	'img/avatar2.jpg'
];
function getRandom(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

var messages = [];
var findName = faker.name.findName;
var namePrefix = faker.name.prefix;
for(var i=0; i<400; i++) {
	messages.unshift({
		author: {
			name: findName(),
			avatarUrl: getRandom(avatars)
		},
		id: i,
		body: faker.lorem.sentence(10),
		createdAt: faker.date.past()
	});
}
messages = _(messages)
.mapValues(function (value, key) {
	value.createdAt = moment(value.createdAt).fromNow();
	value.thumbnailUrl = getRandom(thumbnails);
	return value;
})
.value();

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

MessageController.$inject = ['$scope', 'message'];
function MessageController ($scope, message) {
	$scope.message = message;
}

angular.module('mobie-demo-app',[
	'ngAnimate',
	'mobie',
	'ui.router',
	'mobie-ui-router-history'
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
	})
	.state('app.message', {
		url: '/message/{messageId}',
		templateUrl: 'js/app-message-detail.html',
		controller: MessageController,
		resolve: {
			message: ['$stateParams', function ($stateParams) {
				return _(messages).filter(function (message) {
					return message.id === Number($stateParams.messageId);
				}).first();
			}]
		}
	})
	.state('app.settings', {
		url: '/settings',
		templateUrl: 'js/app-settings.html'
	});
}]);