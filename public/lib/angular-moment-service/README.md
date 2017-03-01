angular-momentjs-service
========================

[AngularJS](https://angularjs.org) Wrapper for [Moment.js](http://momentjs.com) whithout registering it in the global scope.


How to use
----------

1. Install angular-momentjs-service via bower:
	```
	bower install --save angular-momentjs-service
	```

2. Include angular-momentjs-service into your project.
	```HTML
	<script src="angular-momentjs-service.min.js"></script>
	```

3. Add ```angular-momentjs``` module in the dependencies of a angular module:
	```JavaScript
	angular.module('exampleApp', ['angular-momentjs'])
	```

4. Inject the MomentJS service into a controller, a directive, etc:
	```JavaScript
	.controller('ExampleCtrl', ['$scope','MomentJS', function($scope, moment){
		$scope.now = moment();
	}])
	```

5. Use the full MomentJS API as you wish.

How to test
-----------

Soon...

How to contribute
-----------------

I am very glad to see this project living with pull requests.

LICENSE
-------

Copyright (c) 2014 Igor Rafael

Licensed under the MIT license.
