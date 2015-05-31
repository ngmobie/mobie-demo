function $MbHistoryProvider () {
	this.$get = $MbHistoryFactory;

	var defaults = this.defaults = {
		autoBackOnClick: true
	};

	$MbHistoryFactory.$inject = ['$stateHistory', '$q'];
	function $MbHistoryFactory ($stateHistory, $q) {
		var $mbHistory = {};

		function clear () {
			$stateHistory.clear();
		}

		function hasLastState () {
			var lastSt = $mbHistory.getLastState();
			
			if(lastSt && lastSt.state && lastSt.state.name === '') {
				$stateHistory.clear();
				lastSt = $mbHistory.getLastState();
			}

			return (lastSt && lastSt.state && lastSt.state.name !== '');
		}

		function getOptions () {
			return defaults;
		}

		$mbHistory.getOptions = getOptions;

		$mbHistory.getHistoryLength = function () {
			return $mbHistory.getHistory().length;
		};

		$mbHistory.getHistory = function () {
			return $stateHistory.getHistory();
		};

		$mbHistory.getLastState = function () {
			var history = $mbHistory.getHistory();
			return history.length > 0 ? history[0] : false;
		};

		$mbHistory.hasLastState = hasLastState;

		$mbHistory.back = function () {
			if(!hasLastState()) {
				return $q.reject(new Error('there is no last state, you cannot back anymore'));
			}

			return $stateHistory.back();
		};

		return $mbHistory;
	}
}

BackButtonDirective.$inject = ['$mbHistory', 'MbComponent'];
function BackButtonDirective ($mbHistory, MbComponent) {
	return {
		link: function (scope, element, attrs) {
			var component = new MbComponent(element);

			scope.$watch(function () {
				return $mbHistory.hasLastState();
			}, function (hasLastState) {
				scope.hasLastState = hasLastState;
			});

			scope.$watch('hasLastState', function (hasLastState) {
				component[hasLastState ? 'show' : 'hide']();
			});

			if($mbHistory.getOptions().autoBackOnClick) {
				scope.$on('$mbButtonBackPressed', function () {
					$mbHistory.back();
				});
			}

			element.on('click', function () {
				scope.$broadcast('$mbButtonBackPressed');
			});
		}
	};
}

angular.module('mobie-ui-router-history', [
	'ui.router',
	'mobie',
	'ui-router-history',
])
.directive('mbBackButton', BackButtonDirective)
.provider('$mbHistory', $MbHistoryProvider);