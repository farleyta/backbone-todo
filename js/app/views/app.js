var toDoApp = toDoApp || {};

toDoApp.AppView = Backbone.View.extend({

	// This element already exists as a skeleton in index.html
	el: '#todoapp',

	// For the stats at the bottom of the page
	statsTemplate: _.template( $('#stats-template').html() ),

	// On init, we bind to the relevant events on the ToDos collection, whenever
	// items are added or changed
	initialize: function(){
		// store DOM element objects
		this.$allCheckbox = this.$('#toggle-all');
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');
	},

});