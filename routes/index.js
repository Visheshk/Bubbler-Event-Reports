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
  // groupedData = req.app.get("sortedData")
  // sortedData = {};
  cd = req.app.get("clickData");
  sortedData = groupBy(cd, "theme", "act");
  sortedList = unlistDict(sortedData, "theme", "act");
  // sortedList = unlist(sorted)
  // cd.forEach( function (val, index, arr) {
  //   console.log(val);
  //   if (sortedData[val["theme"]] == undefined) {
  //     sortedData[val["theme"]] = [];
  //   }
  //   sortedData[val["theme"]].push(val);
  // })
  // console.log(sortedData);
  // doudata = sortedData["Development of Understanding"];
  // res.render('index', { title: 'Express' , understandingData: doudata});
  // el = makeDict(eventList, "eventName");
  // console.log("event list " + eventList);
  res.render('index', { title: 'Express' , sl: sortedList, evList: eventList});

});

router.get('/:eventName', function(req, res, next) {
  cd = req.app.get("clickData");
  sortedData = groupBy(cd, "theme", "act");
  sortedList = unlistDict(sortedData, "theme", "act");

  flsl = sortedList.filter( function (o){ return o["event"] == req.params.eventName; } );
  res.render('index', { title: 'Express' , sl: flsl, evList: eventList} );
});

function makeDict (eventList, eventName) {
  fl = [];
  for (i in eventList) {
    fl.push({eventName: eventList[i]});
  }
  // console.log(fl);
  return fl;
}

function unlistDict(list, p1, p2) {
  a = Object.keys(list);
  finallist = [];
  for (p1i in list[p1]) {
    for (p2i in list[p2]) {
      // console.log(list[list[p1][p1i]][list[p2][p2i]]);
      if (list[list[p1][p1i]][list[p2][p2i]] != undefined){
        (list[list[p1][p1i]][list[p2][p2i]]).forEach(function (o) {
          o["time"] = new Date(o["epoch"]).toLocaleString();
          finallist.push(o);
        });
      }
    }
  }
  return finallist;
}

function groupBy (list, p) {
  glist = {};
  list.forEach(function (o) {
    if (glist[o[p]] == undefined) { glist[o[p]] = [];  }
    glist[o[p]].push()
  });
}

function groupBy( array , p1, p2 ) {
  var groups = {};
  p1list = [];
  p2list = [];
  array.forEach( function( o ) {
    if (groups[o[p1]] == undefined) {
      groups[o[p1]] = {};
      p1list.push(o[p1])
    }
    if (groups[o[p1]][o[p2]] == undefined) {
      groups[o[p1]][o[p2]] = [];
      p2list.push(o[p2]);
    }
    groups[o[p1]][o[p2]].push(o);
  });
  groups[p1] = p1list;
  groups[p2] = p2list;
  return groups;
}

module.exports = router;
