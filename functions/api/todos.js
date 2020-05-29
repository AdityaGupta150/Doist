const { db } = require('../util/admin')

exports.homeScreen = (req,res) => {
	// res = "bye";
	return res.json("hi");
};

// let lambda_fetchToDos = (data) => {	//Takes data provided by db.collection().order().get()
// 	// let lambda_fetchTodoFromDoc = (doc) => {
// 	// 	todos.push({});	
// 	// }
// 		//QUESTION - How do we 'catch' the scope variables here?
// 	let todos = [];
// 	data.forEach();

// 	return res.json(todos);	
// }

exports.getAllTodos = (req, res) => {

	db.collection('todos')
		.orderBy('createdAt', 'desc')
		.get()
		.then( (data) => {
			let todos = [];
			data.forEach( (doc) => {
				todos.push({
					todoId: doc.id,
					title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});	//forEach takes a callback
		
			console.log("Worked with " + todos);
			if( todos.length != 0 ) return res.json(todos);
			else return res.json({todos: 'No todos left! :D'});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ error : err.code });
		});

};

exports.deleteTodo = (req, res) => {
	const detchedDoc = db.doc('todos/$(req.params.todoId)'); //THINK HERE

	fetchedDoc.get().then( (doc) => {
		if( !doc.exists ){	//QUESTION - What actually is this 'doc' object returned by .get() ?
			// return response.status(404); //Try this!
			return response.status(404).json({error: '404, Todo Not Found'});
		}
		else{
			return fetchedDoc.delete();
		}
	})
	.then( () => {
		response.json({ message: 'Delete successful' });
			//QUESTION - What will it do? Since the function has already exited?
	})
	.catch( (err) => {
		console.error(err);
		return res.status(500).json({ error: err.code });
	});
};

exports.editTodo = (req, res) => {
	if(req.body.todoId || req.body.createdAt){
		res.status(403).json({message: "Not allowed to edit"});
	}

	let fetchedDoc = db.collection('todos').doc('$(request.params.todoId)'); //Try - Try to directly pass req.params.todoId, instead of using $, then passing as string
	
	fetchedDoc.update(req.body)
		.then( () => {
			res.json({ message : 'Updated Successfully'});
		})
		.catch( (err) => {
			return res.status(500).json({ error: err.code});
		});
};

/*HTTP Codes - 
400 -> Bad Request
401 -> Unauthorized (Similar to 403)
403 -> Forbidden
405 -> Method Not allowed (a request method not supported, for eg. GET on a form)
*/

exports.postOneTodo = (req, res) => {
	if ( req.body.body.trim() === '' || req.body.title.trim() === ''){
		return res.status(400).json({ error: 'Body and title of Todo must not be empty!'});
	}

	const newTodoItem = {
		title: req.body.title,
		body: req.body.body,
		createdAt: new Date().toISOString()		
	}

	db.collection('todos')
		.add(newTodoItem)
		.then((doc) => {
			const responseTodoItem = newTodoItem;
			responseTodoItem.id = doc.id;
			return res.json(responseTodoItem);
		})
		.catch( (err) => {
			res.status(500).json({ error: 'Something went Wrong'});
			console.error( err );
		});
};



// exports.homeScreen = homeScreen;	//Else, this ERROR shows : Error: Route.post() requires a callback function but got a [object Undefined]
// module.exports = { ...};
	//QUESTION - Why arent they working

// exports.getAllTodos = (req, res) => {
// 	todos = [
// 	{
// 		'id': '1',
// 		'title' : 'Complete Doist',
// 		'body' : 'Ped par baidh kar ped ugana hai',
// 	},
// 	{
// 		'id' : '2',
// 		'title' : 'Complete Doist',
// 		'body' : 'Ped par baidh kar ped ugana hai',
// 	},
// 	]

// 	//QUESTION - But who 'gives' us these objects, with built-in methods? Is it the express().get() function?
// 	return res.json(todos);
// };
