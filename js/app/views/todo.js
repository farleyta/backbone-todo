toDoApp.ToDoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template( $('#item-template').html() ),

	events: {
		'dblclick label': 'edit', 
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		this.$el.html( this.template( this.model.toJSON() ) );
		this.$input = this.$('.edit');
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

	updateOnEnter: function( e ) {
		if ( e.which === 13 ) {
            this.close();
        }
	}

});