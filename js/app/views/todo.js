toDoApp.ToDoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template( $('#item-template').html() ),

	events: {
		'dblclick label': 'edit', 
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close',
		'click .toggle': 'toggleCompleted'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'visible', this.toggleVisible);
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
		}
		// reset to default (unediting) view of list
		this.$el.removeClass('editing');
	},

	edit: function() {
		this.$el.addClass('editing');
		// make sure the input is populated with the current models title
		// and then give it focus
		this.$input.val(this.model.get('title')).focus();
	},

	toggleCompleted: function() {
		this.model.toggle();
	},

	toggleVisible: function() {
		console.log('toggleVisible Event – check to see if we\'re filtering with the Router.');
	},

	updateOnEnter: function( e ) {
		if ( e.which === 13 ) {
            this.close();
        }
	}

});