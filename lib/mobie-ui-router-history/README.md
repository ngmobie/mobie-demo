# mobie-ui-router-history

### Dependencies
- [mobie](https://github.com/ngmobie/mobie)
- [ui-router-history](https://github.com/VictorQueiroz/ui-router-history)
- [ui-router](https://github.com/angular-ui/ui-router)
- [AngularJS](https://github.com/angular/angular.js)

### Installation
```
bower install --save mobie-ui-router-history
```

### Usage
When the history has any last state on cache, the class 'mb-visible' will be added to the mb-sidenav-back-button element where the directive belong. And the state will be rolled back if you click that element, but, you can avoid that preventing the event `$mbButtonBackPressed`.

```html
<div class="bar">
	<div mb-back-button>
		<i class="fa fa-angle-left"></i>
		<!-- get away from ng-transclude -->
	</div>
</div>
```

Or, you can disable this automatically event, manually:
```js
angular.module('app',['mobie','mobie-ui-router-history'])
.config(function ($mbHistoryProvider) {
	$mbHistoryProvider.defaults.autoBackOnClick = false;
});
```