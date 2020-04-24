//[NOTE] - 'todos' is the collection name, the route has been renamed to todolist
const {db} = require('../util/admin.js'); //import the database object

// exports.getAllTodos = (request, response) => response.json(allTodos);
  /*[LEARNT] - Instead of response.send(), 'returning' after calling a method of 'response', like returning response.json() also works
    [QUESTION] - What's the difference then?
    [QUESTION] - .status() doesnt cause the responding callback to end, does that mean response.send() causes the function to end, like return?*/

//[LEARNT] - In all these, 'request' is an object, containing any data passed by the requesting party ;-)

exports.getAllTodos = (request, response) => {
  db
    .collection('todos').orderBy('createdAt', 'desc')
    .get()
    .then(
      (Todos_Data) => { //callback to 'receive' whole collection
        let Todos_List = [];
        Todos_Data.forEach( (indTodo) => {  //callback to receive each document (indTodo)
            Todos_List.push({ //push takes an object, just like push_back()
              todoId : indTodo.id,  //We can access document ID directly
              title : indTodo.data().TODO_title,
              body : indTodo.data().TODO_content,
              createdAt : indTodo.data().createdAt,
            });
        });
        //Fetched all todos from Todos_Data into Todos_List
        return response.json(Todos_List); //COMPLETED the actual request
    })  //the 'then' block
    .catch(
      //[NOTE] - Even for some error, we call a callback, with the error object
      (err) => {
        // console.error(err);
        console.log("some error friend");
        return response.status(500).json({ error : err.code});
    });
}

exports.editTodo = (request, response) => {
  const indTodo = db.doc('/todos/${request.param.todoId}'); //[QUESTION] - Why the braces around 'request'? Is it necessary in JS also(like in JSX)?

}

exports.rmTodo = (request, response) => {
  const actualIndTodo = db.doc('/todos/${request.params.todoId}');  //received the document, WITHOUT ANY CALLBACK HERE
  acutalIndTodo //NOTE - Renamed indTodo to actualIndTodo, to tell that it is the one that will be deleted
      .get()
      .then( (receivedIndTodo)) => {  //first and ONLY functional callback received the IndividualTodo object using .get()
        if( receivedIndTodo.exists == true){
          return actualIndTodo.delete();
        }
        else{
          return response.status(404).json( {error : 'Todo Not Found'});
        }
      .then( () => {  //2nd callback,is actually empty, and only due to .then()
        response.json({message : "Delete Successfully"});
      })
      .catch( (err) =>{
        console.error(err);
        return response.json({error : err.code});
        //[LEARNT] - Returning from a callback requiring a response, is NECESSARY, either return using .status.json or use .send, etc.
      });
};

exports.postOneTodo = (request, response) => {  //request will contain the todo title and body only
  if(request.body.TODO_title.trim() == '')
    return response.status(400).json({body : "Must not be empty"});
  if(request.body.TODO_content.trim() == '')
    return response.status(400).json({title : "Must not be empty"});

  const newTodo = {
    TODO_title : response.body.TODO_title,
    TODO_content : response.body.TODO_content,
    createdAt : new Date().toISOString(),
  }

  db
    .collection('todos')
    .add(newTodo)
    .then( (tmpResponseTodo) => {
      // const newResponseTodo = newTodo;
      // newResponseTodo.id = tmpResponseTodo.id;
      // return response.status(500).json({error : "Something went wrong!"});

      //[NOTE] - Any difference between above one and below one
      newTodo.id = tmpResponseTodo.id;
      return response.json(newTodo);
    })  //.then()
    .catch( (err) => {
      response.status(500).json({error : "Something went wrong here '-' "});
      console.error(err);
    });
};

//[LEARNT] - The .json can be chained with response.status()
//[LEARNT] - .then(callbackSuccess) and .catch(callbackErr) are chained together, so .then braces dont have a semicolon at end

//[LEARNT_NOTE] - Use callbacks in .then() even if no arguments -
