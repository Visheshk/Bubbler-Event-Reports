require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var firebase = require("firebase");
var config = {
  projectId: process.env.projectId,
  keyFilename: './bin/service-credentials.json'
};

var storage = require('@google-cloud/storage');
var cfst = new storage.Storage(config);

var bucket = cfst.bucket("bubbler-tagger.appspot.com");
// bucket.getFiles().then(function (flist) {
//   for (f in flist) {
//     console.log(flist[f]);
//   }
//   // console.log(JSON.stringify(flist));
// }).catch((err) => {console.log(err);});


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
// var fstore = firebase.storage().ref();
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

firebaseref = fdb.ref();
fref = firebaseref.child("EventsDebug1/ActionList");
eventref = firebaseref.child("EventsDebug1/EventList");
eventList = [];
// console.log(fdb);
sortedData = {"Development of Understanding": [], "Social Scaffolding": []};
fref.on('child_added', function(snapshot) {
  // console.log(snapshot.val())
  var snv = snapshot.val();
  if (snv.imageList != undefined) {
    for (i in snv.imageList) {
      // console.log("trying to clear image");
      snv.imageList[i].image = "";
      var furl = "";
      var thisFile = bucket.file(snv.event + "/" + snv.imageList[i].fileName).getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
        }).then( function (signedUrl) {
          snv.imageList[i].furl = signedUrl;
          // return signedUrl;
        }).catch((err) => console.log(err));
    }
    
  }
  data.push(snv);
  console.log(snv);
  
  if (eventList.indexOf(snv.event) == -1) {
    eventList.push(snv.event);
    // console.log(snv.event);
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
