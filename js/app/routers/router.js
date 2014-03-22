toDoApp.ToDoRouter = Backbone.Router.extend({

	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function(filterParam) {
		if ( filterParam ) {
			filterParam = filterParam.trim();
		}
		toDoApp.ToDoFilter = filterParam || '';

		toDoApp.todoList.trigger('filterVisible');
	}

});

toDoApp.toDoRouter = new toDoApp.ToDoRouter();
Backbone.history.start();