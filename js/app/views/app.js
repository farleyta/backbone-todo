var toDoApp = toDoApp || {};

toDoApp.AppView = Backbone.View.extend({

	// This element already exists as a skeleton in index.html
	el: '#todoapp',

	// For the stats at the bottom of the page
	statsTemplate: _.template( $('#stats-template').html() ),

	// On init, we bind to the relevant events on the ToDoList collection, 
	// whenever items are added or changed
	initialize: function(){
		// store references to DOM element objects
		this.$allCheckbox = this.$('#toggle-all');
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(toDoApp.todoList, 'add', this.addToDo);
		this.listenTo(toDoApp.todoList, 'reset', this.addAllToDos);
	},

	addToDo: function( todo ){
		// Create a new single ToDo view, referencing the ToDo Model that is being added
		var toDoView = new toDoApp.ToDoView({ model: todo });
		// Append the rendered element to the #todo-list <ul>
		$('#todo-list').append( toDoView.render().el );
	},

	addAllToDos: function( allToDos ) {
		// Reset the HTML for the ToDo List
		this.$('#todo-list').html('');
		// iterate through all ToDo items run the addToDo function from above
		allToDos.each( this.addToDo, this );
	}

});