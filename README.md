# GCalTodo

A Todo List application connect with your Google Calendar.

## Installation

- npm install
- gulp

Now visit [http://127.0.0.1:8080]

## Feature

  - uses Browserify to build the client code from the `client` to the `public` folder
  - uses **$stateProvider** for the (HTML5 PushState supported) routing
  - uses **SASS** as pre processor
  - uses a **.jshintrc**
  - uses **Gulp** as build tool that does:
  	- view compiling
  	- sass conversion
  	- browserify-ing all teh things
  	- cleaning the build folder

## Todos

  - Filter todo by date range
  - interface for editing Todo date and description
  - Watch Google Calendar event to syn todo automatcially
  - Able to select different Calendars as Todo List instead of only default Calendar