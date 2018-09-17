/* List of dependancies here 
*/
var Helpers = require('../helpers');
var js2xmlparser = require("js2xmlparser");
var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;
var js2xmlparserOptions={}
var parseStringOptions={
	"explicitArray":false,
	"valueProcessors": [ xml2js.processors.parseNumbers ]
}

/* Inlcude Routes */
exports.includeRoutes = function (app) {
	
	app.get('/noauth', function(req, res , next){
    res.send('open route')
  });

	app.get('/withauth', Helpers.checkAuth, function(req, res , next){
    res.send('secure route')
    // do stuff
  });

  app.post('/testxmlapi', function(req, res , next){
    console.log('from json',req.body.data)
    var xmldata = js2xmlparser("testxml",req.body.data,js2xmlparserOptions)
    console.log('to xml',xmldata)
    parseString(xmldata,parseStringOptions, function (err, result) {
		  console.log('to json again',result)
		  
		  res.send({returnjson:result})
		});
    // do stuff
  });
}

/* For DB Op.
var DB = require('./db')
var db = new DB(app.locals.env.db)
db.get()
*/