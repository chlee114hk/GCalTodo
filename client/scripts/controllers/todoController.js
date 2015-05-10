'use strict';

module.exports = function TodoController ($scope, Todos, $cookies, Auth) {
	$scope.editing = [];
	$scope.show = "All";
	$scope.todos = Todos.query(
		function(data) {
			//success callback
		},
		function(data) {
			if (data && data.status == 401 && data.statusText == "Unauthorized") {
				$scope.todos = [];
			}
		}
	);
	
	$scope.getDetails = function(index, event) {
		console.log($cookies, Auth)
		var todo = $scope.todos[index];
		if ($scope.selected == todo.id) {
			$scope.selected = null;
			$scope.details = null;
			return;
		}
		Todos.get({ id: todo.id }, function(data) {
			$scope.selected = todo.id;
			$scope.details = data;
		});
	};

	$scope.add = function(){
		if (!$scope.newTodoName || $scope.newTodoName.length < 1) {
			alert("Please enter Todo Name!");
			return;
		}
		if (!$scope.newTodoDate || $scope.newTodoDate.length < 1) {
			alert("Please select date for Todo!");
			return;
		}
		if (!Date.parse($scope.newTodoDate, "yy-mm-dd")) {
			alert("Wrong date format!");
			return;
		}
		
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
			$scope.newTodoDate = '';
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

	$scope.delete = function(index, event){
		event.stopImmediatePropagation();
		var todo = $scope.todos[index];
		Todos.remove({id: todo.id}, function(){
			$scope.todos.splice(index, 1);
			if ($scope.selected == todo.id) {
				$scope.selected = null;
				$scope.details = null;
			}
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
