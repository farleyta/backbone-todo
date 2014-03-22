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

        // Add our event listeners
        this.listenTo(this.todoList, 'add', this.addToDo);
        this.listenTo(this.todoList, 'reset', this.addAllToDos);
        this.listenTo(this.todoList, 'change:isComplete', this.triggerVisible);
        this.listenTo(this.todoList, 'filterVisible', this.triggerAllVisible);
        this.listenTo(this.todoList, 'all', this.render);

        // Grab the locally stored collection of ToDos
        this.todoList.fetch();
    },

    // Delegate certain events for creating new items and clearing old ones
    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllCompleteStatus'
    },

    addToDo: function( toDoModel ){
        // Create a new single ToDo view, referencing the ToDo Model that is being added
        var toDoView = new toDoApp.ToDoView({ model: toDoModel });
        // Append the rendered element to the #todo-list <ul>
        $('#todo-list').append( toDoView.render().el );
    },

    addAllToDos: function( allToDos ) {
        // Reset the HTML for the ToDo List
        this.$listOfTodos.html('');
        // iterate through all ToDo items run the addToDo function from above
        allToDos.each( this.addToDo, this );
    },

    clearCompleted: function() {
        _.invoke( this.todoList.getCompleted(), 'destroy');
        return false;
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

    render: function() {

        //Get the values of completed / remaining ToDos
        var numCompleted = this.todoList.getCompleted().length,
            numRemaining = this.todoList.getRemaining().length;

        // As long as there are ToDos, render the HTML for the list
        if ( this.todoList.length ) {
            // show the list and footer
            this.$main.show();
            this.$footer.show();

            // populate the footer markup with the num of completed / remaining
            this.$footer.html( this.statsTemplate({
                numCompleted: numCompleted,
                numRemaining: numRemaining
            }));

            // Choose the proper filter option to have the .selected class
            this.$('#filters li a').removeClass('selected').filter('[href="#/' + toDoApp.ToDoFilter + '"]').addClass('selected');

        } else {
            // no items, hide the list and footer
            this.$main.hide();
            this.$footer.hide();
        }

        // apply the .selected class to the proper filter link
            
        // if all items in the list are completed, check the all Completed box
        if ( ! numRemaining ) {
            this.$allCheckbox.checked = true;
        }
    },

    toggleAllCompleteStatus: function() {

        // find current value of the toggle-all checkbox
        var isComplete = this.$allCheckbox.checked;

        this.todoList.each( function(toDoModel){
            toDoModel.save({
                'isComplete': isComplete
            });
        });
    },

    triggerVisible: function( toDoModel ) {
        toDoModel.trigger('visible');
    },

    triggerAllVisible: function() {
        this.todoList.each( this.triggerVisible, this );
    }

});