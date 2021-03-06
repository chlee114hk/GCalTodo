'use strict';

var should = require('should'),
    app = require('../../../server'),
    Todo = require('../../../client/scripts/modules/todo'),
    request = require('supertest');

describe('GET /api/todos', function() {
  
  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/todos')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe('POST /api/todos', function() {
  
  it('should respond with added todo', function(done) {
    request(app)
      .post('/api/todos')
      .send({
        name: 'todoTitle',
        completed: false
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(done);
  });

  afterEach(function(done) {
    Todo.remove();
    done();
  });
});

describe('PUT /api/todos/:todoId', function() {
  var todo,
      updatedName = 'newTitle';

  beforeEach(function(done) {
    todo = new Todo({
      name: 'todoTitle',
      completed: false
    });

    todo.save(function(err) {
      done();
    });
  });

  afterEach(function(done) {
    Todo.remove();
    done();
  });

  function sendRequest() {
    return request(app)
      .put('/api/todos/' + todo._id)
      .send({
        name: updatedName,
        completed: false
      });
  }

  it('should respond with todo', function(done) {
    sendRequest()
      .expect(200)
      .expect('Content-Type', /json/)
      .end(done);
  });

  it('should update todo in database', function(done) {
    sendRequest()
      .end(function() {
        Todo.findById(todo._id, function(err, updatedTodo) {
          updatedTodo.name.should.equal(updatedName);
          done();
        });
      });
  });
});

describe('DEL /api/todos/:todoId', function() {
  var todo;

  beforeEach(function(done) {
    todo = new Todo({
      name: 'todoTitle',
      completed: false
    });

    todo.save(function(err) {
      done();
    });
  });

  afterEach(function(done) {
    Todo.remove();
    done();
  });

  function sendRequest() {
    return request(app)
      .del('/api/todos/' + todo._id);
  }

  it('should respond with 200', function(done) {
    sendRequest()
      .expect(200).end(done);
  });

  it('should delete the todo', function(done) {
    sendRequest()
      .expect(200).end(function() {
        Todo.find({}, function(err, todos) {
          todos.should.have.length(0);
          done();
        });
      });
  });
});
