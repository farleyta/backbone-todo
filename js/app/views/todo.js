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