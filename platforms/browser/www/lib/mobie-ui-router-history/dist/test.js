angular.module('mb-module-mock',['ui.router'])
.config(function ($stateProvider) {
	$stateProvider
	.state('state1', {
		url: '/state1',
		template: 'hey, this is my state1 <div ui-view></div>'
	})
	.state('state1.substate1', {
		url: '/substate1',
		template: 'hey, thats a substate'
	})
})

describe('mobie-ui-router-history', function () {
	var $mbHistory, $rootScope, $compile, $animate, $stateHistory, $browser;
	beforeEach(module('ngAnimateMock'))
	beforeEach(module('mb-module-mock'))
	beforeEach(module('mobie-ui-router-history'));
	beforeEach(inject(function (_$rootScope_, _$browser_, _$stateHistory_, _$mbHistory_, _$compile_, _$state_, _$animate_) {
		$mbHistory = _$mbHistory_;
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$state = _$state_;
		$animate = _$animate_;
		$stateHistory = _$stateHistory_;
		$browser = _$browser_;
	}));

	it('should render a back button', function () {
		var tpl = '<body><div>' +
			'<div class="bar">' +
				'<div mb-back-button>' +
					'<a>{{ mytext }}</a>' +
				'</div>' +
			'</div>' +
			'<div ui-view></div>' +
		'</div></body>';
		var scope = $rootScope.$new();
		scope.mytext = 'Back';
		var el = $compile(angular.element(tpl))(scope);

		$rootScope.$digest();

		var backButtonEl = angular.element(el[0].querySelector('[mb-back-button]'));
		assert.ok(backButtonEl.hasClass('mb-hidden'));

		$state.go('state1');
		$rootScope.$digest();

		$state.go('state1.substate1');
		$rootScope.$digest();
		$animate.triggerCallbacks();

		scope.$on('$mbButtonBackPressed', function () {
			scope.$apply(function () {
				$mbHistory.back();
			});
		});

		assert.equal(false, backButtonEl.hasClass('mb-hidden'))

		backButtonEl.click();

		assert.equal('state1', $state.current.name);

		$state.go('state1.substate1');
		$rootScope.$digest();

		$state.go('state1');
		$rootScope.$digest();

		assert.equal(2, $mbHistory.getHistoryLength());
		assert.equal('state1', $state.current.name);

		backButtonEl.click();

		assert.equal('state1.substate1', $state.current.name);

		backButtonEl.click();

		assert.equal('state1', $state.current.name);
		
		backButtonEl.click();
	});
});