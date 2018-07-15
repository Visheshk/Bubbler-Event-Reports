var express = require('express');
var router = express.Router();
var firebase = require("firebase");

// var config = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   databaseURL: process.env.databaseURL,
//   storageBucket: process.env.storageBucket,
// };


// firebase.initializeApp(config);

/* GET home page. */
router.get('/', function(req, res, next) {
  groupedData = req.app.get("sortedData")
  cd = req.app.get("clickData")
  console.log("template printing:" +  cd);
  sortedData = {};
  cd.forEach( function (val, index, arr) {
    console.log(val);
    if (sortedData[val["theme"]] == undefined) {
      sortedData[val["theme"]] = [];
    }
    sortedData[val["theme"]].push(val);
  })
  console.log(sortedData);
  doudata = sortedData["Development of Understanding"];
  res.render('index', { title: 'Express' , understandingData: doudata});

});

module.exports = router;
