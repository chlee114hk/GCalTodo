'use strict';
//================================================================================
// Libraries
//================================================================================
var express = require('express');
var config  = require('../config');
var gcal    = require('google-calendar');
var moment  = require('moment');

//================================================================================
// Properties
//================================================================================
var router = express.Router();

//================================================================================
// Module
//================================================================================
/**
 * This middleware will be run before every api call to this router to ensure the
 * use has an access token. Otherwise, it will return a 401 response which will
 * the user to be automatically logged out.
 */
router.use(function(req, res, next) {
    if(!req.session.accessToken) {
      res.status(401).send('You are not logged in Google.');
    } else {
      next();
    }
});

router.get('/todos', function(req, res, next) {
	var calendar = new gcal.GoogleCalendar(req.session.accessToken);
	var options = {};
	options.timeMin = req.body.fromDate ? req.body.fromDate : new Date().toISOString();
	if (req.body.toDate) options.timeMax = req.body.endDate;

	calendar.events.list(req.session.calendarId, options, function(err, eventList) {
			if(err) return next(err);

			var todoList = [];
			var events = eventList.items;
			for(var i in events){
				var todo = event2todo(events[i]);
				todoList.push(todo);
			}
			res.status(200).send(JSON.stringify(todoList, null, '\t'));
  });	
});

router.get('/todos/:id', function(req, res, next) {
	var calendar = new gcal.GoogleCalendar(req.session.accessToken);
	calendar.events.get(req.session.calendarId, req.params.id, null, function(err, event) {
		if(err) return next(err);

		res.status(200).send(JSON.stringify(event, null, '\t'));
	});
});


router.post('/todos', function(req, res, next) {
	var calendar = new gcal.GoogleCalendar(req.session.accessToken);
	var addEventBody = {
		'status':'confirmed',
		'summary': req.body.name,
		'description': req.body.description,
		'organizer': {
			'email': req.session.calendarId,
			'self': true
    },
		'start': {
			'date': req.body.date
    },
		'end': {
			'date': moment(req.body.date, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD')
		},
		'extendedProperties': {
			'private': {
				completed: false,
				isTodo: true
			}
		}
	};

	calendar.events.insert(req.session.calendarId, addEventBody, function(err, response) {
		if(err) {
			console.log('err ', err)
			return next(err);
		}

		res.status(200).send(event2todo(response));
	});
});

router.put('/todos/:id', function(req, res, next) {
	var calendar = new gcal.GoogleCalendar(req.session.accessToken);
	var update = todo2event(req.body);
	if (update.start && update.start.date) {
		update.end = {};
		update.end.date = moment(update.start.date, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD');
	}
console.log(update)
	calendar.events.update(req.session.calendarId, req.params.id, update, function(err, response) {
		if(err) {
			console.log('err ', err)
			return next(err);
		}

		res.status(200).send(response);
	})
});

router.delete('/todos/:id', function(req, res, next) {
	var calendar = new gcal.GoogleCalendar(req.session.accessToken);
	calendar.events.delete(req.session.calendarId, req.params.id, function(err, response) {
		if(err) return next(err);

		res.status(200).send(response);
	})
});

var event2todo = function(event) {
	var todo = {};
	todo.id = event.id;
	todo.name = event.summary;
	todo.date = event.start.date;
	todo.completed = event.extendedProperties ? eval(event.extendedProperties.private.completed) : false;
	todo.isTodo = event.extendedProperties && event.extendedProperties.private.isTodo ? eval(event.extendedProperties.private.isTodo) : false;
	return todo;
}; 

var todo2event = function(todo) {
	var fieldMap = {
		'name'        : 'summary',
		'description' : 'description',
		'date'        : 'start.date',
		'completed'   : 'extendedProperties.private.completed',
		'isTodo'			: 'extendedProperties.private.isTodo'
	}
	var event = {};
	for (var key in todo) {
		if (!fieldMap[key]) continue;
		var keys = fieldMap[key].split('.');
		var variable = 'event.' + keys[0];
		for (var i=0; i < keys.length; i++) {
			if (i == keys.length - 1) {
				console.log("tyep ", typeof(todo[key]))
				eval(variable + " = " + (typeof(todo[key]) != 'string' ?  todo[key] : '"' + todo[key] + '"'));
			}else{
				eval(variable + " = " + variable + " || {}");
				variable += "." + keys[i+1];
			}
		}
	}
	return event;
};

module.exports = router;
