var Helpers = require('./helpers')
var Authentication = require('./../controllers/loginController.js')
// var masterListController = require('./../controllers/masterListController.js')
// var transactionController = require('./../controllers/transactionController.js')
// var dbController = require('./../controllers/dbController.js')
// var dbConsoleController = require('./../controllers/dbConsoleController.js')

module.exports = function(app){
	
	app.get("/", Authentication.welcome);
	
	/* ------------------ Authentication ------------------ */
	app.post("/login", Authentication.login);
	app.get("/status", Authentication.status);
	// app.get("/status", Helpers.checkAuth, Authentication.status);
	app.get("/logout", Authentication.logout);

	/* ------------------ MasterList ------------------ */

	/* ------------------ Transaction ------------------ */
	
	/* ------------------ DB Ops------------------ */


}

/*

var Sample = require('./sample-module/sm.js')
var Authentication = require('./auth/authentication.js')

module.exports = function(app){
	app.get("/", function (req, res) {
	  res.render('index', { template locals context  });
	});
	
	Sample.includeRoutes(app)
	Authentication.includeRoutes(app)
}

*/