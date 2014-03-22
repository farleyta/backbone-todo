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