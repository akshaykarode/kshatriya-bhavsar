// var jwt = require('jsonwebtoken')
// var jwtconfig = require('./../configs/jwt-config.json')
var Q = require('q');

module.exports = {

	checkAuth : function(req,res,next){
	  if(!req.session.user){
	  	return res.status(403).send({
	        success: false, 
	        message: 'No Session found.Please Login Again !' 
	    });
	  }else{
	    next();
	  }
	}
	
}