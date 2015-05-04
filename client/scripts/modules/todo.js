'use strict';

module.exports = angular.module('todo', [require('angular-resource')])
	.factory('Todos', require('../services/todoFactory'))
	.controller('TodoController', require('../controllers/todoController'));