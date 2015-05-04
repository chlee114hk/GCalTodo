'use strict';

var $, jQuery;
$ = jQuery = require('jquery');
require('jquery-ui');

require('angular');
var uiRoute = require('angular-ui-router');
var ngCookies = require('angular-cookies');
var ngResource = require('angular-resource');

require('./services/authentication');
require('./modules/todo');

var app = angular.module('MyApp', [
	uiRoute, 
	ngCookies,
	ngResource,
	'authentication',
	'todo'
]);

app.config(function($locationProvider, $stateProvider) {

  $locationProvider.html5Mode(true);

	$stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html'
  })
  .state('todo', {
    url: '/',
    templateUrl: 'views/todo.html'
  });

});

app.run();
