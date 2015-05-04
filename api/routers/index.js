'use strict';
//================================================================================
// Libraries
//================================================================================
var AuthRouter   = require('./auth');
var GoogleRouter = require('./google');
var TodoRouter = require('./todo');

//================================================================================
// Module
//================================================================================
module.exports.auth   = AuthRouter;
module.exports.google = GoogleRouter;
module.exports.todo = TodoRouter;