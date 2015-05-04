'use strict';

module.exports = function Todos($resource){
	return $resource('/api/todos/:id', { id: "@id" }, 
		{
			'update': { method:'PUT' }
		}
	);
};