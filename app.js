require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var firebase = require("firebase");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
};

firebase.initializeApp(config);

// console.log(config)
var fdb = firebase.database();
// app.set('firedb', fdb);
connectedRef = fdb.ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    console.log("connected");
  } else {
    console.log("not connected");
  }
});


data = [];
evNameList = [];
eventNameDict = {};
// console.log(fdb);

// function groupBy( array , f ) {
//   var groups = {};
//   array.forEach( function( o ) {
//     var group = JSON.stringify( f(o) );
//     groups[group] = groups[group] || [];
//     groups[group].push( o );  
//   });
//   return Object.keys(groups).map( function( group ){
//     return groups[group]; 
//   })
// }

// var result = groupBy(list, function(item){
//   return [item.lastname, item.age];
// });

firebaseref = fdb.ref();
fref = firebaseref.child("EventsDebug1/ActionList");
eventref = firebaseref.child("EventsDebug1/EventList");
eventList = [];
// console.log(fdb);
sortedData = {"Development of Understanding": [], "Social Scaffolding": []};
fref.on('child_added', function(snapshot) {
  // console.log(snapshot.val())
  data.push(snapshot.val());
  
  if (eventList.indexOf(snapshot.val().event) == -1) {
    eventList.push(snapshot.val().event);
    // console.log(snapshot.val().event);
  }
  app.set('clickData', data);
  app.set('eventList', eventList);
  // app.set('groupedData', sortedData);
  // console.log(sortedData);
});

eventNameDict[""] = {"eventCode": "none", "eventOrganizer": ""};
eventref.on('child_added', function(snapshot) {
  // console.log(snapshot.val())
  evNameList.push(snapshot.val());
  // console.log(snapshot.key);
  eventNameDict[snapshot.key] = snapshot.val()
  app.set("eventNameList", evNameList);
  app.set("eventNameDict", eventNameDict);

});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
