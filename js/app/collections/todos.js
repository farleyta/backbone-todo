// Create a new wrapper object
var toDoApp = toDoApp || {};

var ToDoList = Backbone.Collection.extend({
    
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