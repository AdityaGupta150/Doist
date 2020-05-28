const firebase_functions = require('firebase-functions');

const express_app = require('express')();

let trialCallback = (request, response) => response.send("Hello from firebase");

const {..,getAllTodos,postOneTodo, editTodo, deleteTodo} = require('./APIs/returnTodos')
express_app.get('/todolist', getAllTodos); //routed GET calls to '/todos' to getAllTodos callback
express_app.post('/todoAPi', postOneTodo);
express_app.update('/todoAPi/:todoId', editTodo);
express_app.delete('/todoAPi:todoId', deleteTodo);

exports.helloWorld = firebase_functions.https.onRequest( trialCallback );
exports.api = firebase_functions.https.onRequest( express_app )//'api' will be the name of the function
