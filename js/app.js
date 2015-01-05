'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
	.module('marcado', [
		'ngRoute',
		'components',		
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/check.html',
				controller: 'CheckCtrl'
			})
			.when('/:id', {
				templateUrl: 'views/check.html',
				controller: 'CheckCtrl'
			})
			.when('/lista/:paginacion', {
				templateUrl: 'views/lista.html'
			})
			.when('/cambiarpass', {
				templateUrl: 'views/cambiarpass.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});