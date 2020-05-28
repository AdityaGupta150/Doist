const { db } = require('../util/admin')

const homeScreen = (req,res) => {
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

const getAllTodos = (req, res) => {

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
		
			return res.json(todos);
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ error : err.code });
		});

};

const deleteTodo = (req, res) => {
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

const editTodo = (req, res) => {
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

exports.homeScreen;
exports.getAllTodos;
exports.deleteTodo;
exports.editTodo;

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
