toDoApp.todoList = new toDoApp.ToDoList();

toDoApp.todoView = new toDoApp.AppView();

toDoApp.todoList.reset([
    { title: "Test2", isComplete: true, orderNum: 1 }, 
    { title: "Test3", isComplete: false, orderNum: 2 }, 
    { title: "Test4", isComplete: false, orderNum: 3 }
]);