var jwt = require('jsonwebtoken')
var jwtconfig = require('./../configs/jwt-config.json')
var Q = require('q');

module.exports = {

	checkAuth : function(req,res,next){
		// check header or url parameters or post parameters for token
	  var token = req.body.authtoken || req.query.token || req.headers['x-access-token'];
	  // decode token
	  if(token){
	    // verifies secret and checks exp
	    jwt.verify(token, jwtconfig.secrete , function(err, decoded) {      
	      if(err){
	      	switch(err.name){
	      		case 'TokenExpiredError' : 
	      					err.code='JWT001'
	      					err.message='authoken expired !'
	      					break;
	      		case 'JsonWebTokenError' : 
	      					err.code='JWT002'
	      					err.message='authoken is malformed !'
	      					break;
	      		default : break;
	      	}
	      	console.log('Error in Token : ',err.message)
	        return res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate authtoken.',
	        	details : err
	        })    
	      }else{
	        req.decoded = decoded; // if all good, save to request for use in other routes
	        next();
	      }
	    });
	  }else{ // if there is no token
	    return res.status(403).send({
	        success: false, 
	        message: 'No authtoken provided.' 
	    });
	  }
	},

	decodeAuth : function(token){
		var deferred=Q.defer()

	  // decode token
	  if(token){
	    // verifies secret and checks exp
	    jwt.verify(token, jwtconfig.secrete , function(err, decoded) {  
	      if(err){
	      	console.log('Error in Token : ',err.message)
	        deferred.resolve({
	        	success: false,
	        	message: 'Failed to authenticate authtoken.',
	        	details : err
	        })
	      }else{
	        deferred.resolve({
	        	success: true,
	        	decoded:decoded
	        	}); // if all good, save to request for use in other routes
	      }
	    });
	  }else{ // if there is no token
	    deferred.resolve({
	        success: false, 
	        message: 'No authtoken provided.' 
	    })
	  }
	  return deferred.promise;
	},
	prepareGetRequestParams: function(obj,isMaster){
		var o={}
		switch(obj.login_type){
			case "arn":o={
					"BrokerCode":obj.brokerCode,
					"Appln_Id":obj.applicationId,
					"Password":obj.password
				}
				break;
			case "ria":o={
					"RiaCode":obj.riaCode,
					"Appln_Id":obj.riaApplicationId,
					"Password":obj.riaPassword
				}
				break;
			default:o={
					"BrokerCode":obj.brokerCode,
					"Appln_Id":obj.applicationId,
					"Password":obj.password
				}
				break;
		}

		if(isMaster){
			o={
				"BrokerCode":obj.brokerCode,
				"Appln_Id":obj.applicationId,
				"Password":obj.password
			}
		}
		return o;
	},

	preparePostRequestData: function(obj,isMaster){
		var o={}
		switch(obj.login_type){
			case "arn":o={
					"appln_id":obj.applicationId,
					"password":obj.password,
					"broker_code":obj.brokerCode
				}
				break;
			case "ria":o={
					"appln_id":obj.riaApplicationId,
					"password":obj.riaPassword,
					"ria_code":obj.riaCode
				}
				break;
			default:o={
					"appln_id":obj.applicationId,
					"password":obj.password,
					"broker_code":obj.brokerCode
				}
				break;
		}

		if(isMaster){
			o={
				"BrokerCode":obj.brokerCode,
				"Appln_Id":obj.applicationId,
				"Password":obj.password
			}
		}
		return o;
	},

	toXmlWrap : function(xmlPost){
		return '<NMFIIService>'+xmlPost+'</NMFIIService>';
	},
	
	toQueryParams : function(defaultParams,extraParams){
		var arr=[]
		for(var key in defaultParams)
			arr.push(key+"="+defaultParams[key])
		if(extraParams)
			for(var key in extraParams)
				arr.push(key+"="+extraParams[key])
		return arr.join('&');
	},

	verifyResponse : function(obj){
		if(obj.service_status.service_return_code!=0)
			return obj.service_response;
		return obj.service_status;
	},

	verifyTransactionResponse : function(obj){
		return (obj.service_status && obj.service_status.service_return_code==0)
	}

}