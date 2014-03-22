var toDoApp = toDoApp || {};

toDoApp.AppView = Backbone.View.extend({

    // This element already exists as a skeleton in index.html
    el: '#todoapp',

    // For the stats at the bottom of the page
    statsTemplate: _.template( $('#stats-template').html() ),

    // On init, we bind to the relevant events on the ToDoList collection, 
    // whenever items are added or changed
    initialize: function(){

        // Shortcut to access our Collection
        this.todoList = toDoApp.todoList;

        // store references to DOM element objects
        this.$allCheckbox = this.$('#toggle-all')[0];
        this.$listOfTodos = this.$('#todo-list');
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        this.listenTo(this.todoList, 'add', this.addToDo);
        this.listenTo(this.todoList, 'reset', this.addAllToDos);
    },

    // Delegate certain events for creating new items and clearing old ones
    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllCompleteStatus'
    },

    addToDo: function( todo ){
        // Create a new single ToDo view, referencing the ToDo Model that is being added
        // var toDoView = new toDoApp.ToDoView({ model: todo });
        // Append the rendered element to the #todo-list <ul>
        // $('#todo-list').append( toDoView.render().el );
        console.log( todo.get('title'));
    },

    addAllToDos: function( allToDos ) {
        // Reset the HTML for the ToDo List
        this.$listOfTodos.html('');
        // iterate through all ToDo items run the addToDo function from above
        allToDos.each( this.addToDo, this );
    },

    clearCompleted: function() {
        _.invoke( this.todoList.getCompleted(), function() {
            this.destroy();
        });
    },

    createOnEnter: function( e ) {
        //if the keypress is anything other than Enter (13), or the field is empty
        if ( e.which !== 13 || !this.$input.val().trim() ) {
            return;
        } else {
            this.todoList.create( this.newToDoAttrs() );
        }
        // And clear the input for the next task
        this.$input.val('');

    },

    newToDoAttrs: function() {
        return {
            title: this.$input.val(),
            orderNum: this.todoList.nextOrderNum(),
            isComplete: false
        };
    },

    toggleAllCompleteStatus: function() {

        // find current value of the toggle-all checkbox
        var isComplete = this.$allCheckbox.checked;

        this.todoList.each( function(toDoModel){
            toDoModel.save({
                'isComplete': isComplete
            });
        });
    }

});