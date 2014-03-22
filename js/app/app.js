// Set the namespace
var toDoApp = toDoApp || {};
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
toDoApp.ToDoList = Backbone.Collection.extend({
    
    model: toDoApp.ToDo,

    comparator: 'orderNum',

    localStorage: new Backbone.LocalStorage('backbone-todo'),

    getCompleted: function(){
        // get all completed ToDos
        return this.where({ isComplete: true });
    },

    getRemaining: function(){
        // get all completed ToDos
        return this.where({ isComplete: false });
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

toDoApp.todoList = new toDoApp.ToDoList();
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
toDoApp.ToDoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template( $('#item-template').html() ),

	events: {
		'dblclick label': 'edit', 
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close',
		'click .toggle': 'toggleCompleted',
		'click .destroy': 'destroyToDo'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'visible', this.toggleVisible);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function() {
		// Render the individual todo item
		this.$el.html( this.template( this.model.toJSON() ) );
		// set a shortcut to the jQuery DOM object for the editing input
		this.$input = this.$('.edit');
		// toggle the completed class on the <li> depending on whether the model is complete
		this.$el.toggleClass( 'completed', this.model.get('isComplete') );

		return this;
	},

	close: function() {

		// The new value of the title
		var title = this.$input.val().trim();
		
		// Update the title of the model
		if ( title ) {
			this.model.save({
				title: title
			});
		} else {
			// if title is blank, set it back to the current title on the model
			this.$input.val( this.model.get('title') );
		}
		// reset to default (unediting) view of list
		this.$el.removeClass('editing');
	},

	destroyToDo: function() {
		this.model.destroy();
	},

	edit: function() {
		this.$el.addClass('editing');
		this.$input.focus().select();
	},

	isHidden: function() {
		var isComplete = this.$el.hasClass('completed');
		
		switch(toDoApp.ToDoFilter) {
			case 'active':
				return isComplete; // hide those that are complete
			case 'completed':  
				// show only ToDos that have class .completed
				return !isComplete; // only hide those that aren't complete
			default:
				return false;
		}
	},

	toggleCompleted: function() {
		this.model.toggle();
	},

	toggleVisible: function() {
		// Toggle the "hidden" class on the <li>, based on result of isHidden()
		this.$el.toggleClass('hidden', this.isHidden());
	},

	updateOnEnter: function( e ) {
		if ( e.which === 13 ) {
            this.close();
        }
	}

});
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
$(function() {

	// Kick things off...
    new toDoApp.AppView();

});