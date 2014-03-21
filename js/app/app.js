// Create a new wrapper object
var toDoApp = toDoApp || {};

// 
toDoApp.ToDo = Backbone.Model.extend({
	defaults: {
		title: '',
		isComplete: false
	},
	// Toggle between completed and incompleted states
	toggle: function(){
		this.save({ isComplete: !this.get('isComplete') });
	}
});
// Create a new wrapper object
var toDoApp = toDoApp || {};

toDoApp.ToDoList = Backbone.Collection.extend({
    
    model: toDoApp.ToDo,

    comparator: 'orderNum',

    localStorage: new Backbone.LocalStorage('backbone-todo'),

    getCompleted: function(){
        // filter through all items in the Collection, and...
        return this.filter(function(toDoModel){
            // return any model in which isComplete is true
            return toDoModel.get('isComplete');
        });
    },

    getRemaining: function(){
        // filter through all items in the Collection, returning only incompleted
        return this.filter(function(toDoModel){
            // return any model in which isComplete is false
            return ! toDoModel.get('isComplete');
        });
    },

    // Function for assigning the ToDos a number in sequential order
    nextOrderNum: function(){

        // If we're adding the first item, set to 1
        if ( this.length < 1 ) {
            return 1;
        } else {
            // Otherwise, find the highest value in the collection and add 1
            return this.max( function(toDoModel){
                return toDoModel.get('orderNum');
            } ).get('orderNum') + 1;
        }
    }

});
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


toDoApp.todoList = new toDoApp.ToDoList();

toDoApp.todoView = new toDoApp.AppView();