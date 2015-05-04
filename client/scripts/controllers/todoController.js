'use strict';

module.exports = function TodoController ($scope, Todos) {
	$scope.editing = [];
	$scope.show = "All";
	$scope.todos = Todos.query();
	
	$scope.getDetails = function(index, event) {
		var todo = $scope.todos[index];
		Todos.get({ id: todo.id }, function(data) {
			$scope.selected = todo.id;
			$scope.details = data;
		});
	};

	$scope.add = function(){
		if(!$scope.newTodoName || $scope.newTodoName.length < 1) return;
		var todo = new Todos({ 
			name: $scope.newTodoName, 
			date: $scope.newTodoDate,
			description: $scope.newTodoDescription,
			completed: false,
			isTodo: true
		});

		todo.$save(function(){
			$scope.todos.push(todo);
			// clear textbox
			$scope.newTodoName = ''; 
			$scope.newTodoDescription = '';
		});
	};

	$scope.update = function(index){
		var todo = $scope.todos[index];
		Todos.update({id: todo.id}, todo);
		$scope.editing[index] = false;
	};

	$scope.edit = function(index){
		$scope.editing[index] = angular.copy($scope.todos[index]);
	};

	$scope.cancel = function(index){
		$scope.todos[index] = angular.copy($scope.editing[index]);
		$scope.editing[index] = false;
	};

	$scope.delete = function(index){
		var todo = $scope.todos[index];
		Todos.remove({id: todo.id}, function(){
			$scope.todos.splice(index, 1);
		});
	};
	
	/* Filter Function for All | Incomplete | Complete */
	$scope.showFn = function(todo) {
		if ($scope.show === "All") {
			return true;
		}else if (todo.completed && $scope.show === "Complete"){
			return true;
		}else if (!todo.completed && $scope.show === "Incomplete"){
			return true;
		}else{
			return false;
		}
	};
};
