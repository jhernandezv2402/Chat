angular.module('privateRoutes', ['ngRoute'])
	.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/:id', {

				templateUrl : '/views/pages/imPrivate.html',
				controller : 'privateController',
				controllerAs : 'private'


			})
	})