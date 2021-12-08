const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();

// use port 4000 for the node.js backend
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// import the todo schema
let Todo = require('./todo.model');

// connect to the Mongo DB database
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// define the backend API endpoints 
todoRoutes.route('/').get(function(req, res) {
    // returns a list of all the todos in the database
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    // get a specific todo from the database by id
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    // update a specific todo by id
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/delete/:id').post(function(req, res) {
    // delete a single todo from the database by id
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.deleteOne().then(todo => {
                res.json('Todo Deleted!');
            })
            .catch(err => {
                res.status(400).send("Delete not possible");
            });
    });
});

todoRoutes.route('/add').post(function(req, res) {
    // add a new todo to the database
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

// add the todo routing to the middleware
app.use('/todos', todoRoutes);

// start the node.js server
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
