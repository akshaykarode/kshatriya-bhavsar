var _request = require('request'),
		Q = require('q');

module.exports = {

	get : function(url){
		var deferred = Q.defer();
		_request(url,function (error, response, body) {
	    if(error){
	      console.log('Soap Request Get Err:', error);
	    	deferred.reject(error)
	    }
	    deferred.resolve(body)
	  })
		return deferred.promise;
	},
	post : function(url,data){
		var deferred = Q.defer();
		var options = {
			'url':url,
			'headers':{
				'Content-Type':"application/xml"
			},
			'body':data,
		}
		_request.post(options,function (error, response, body) {
	    if(error){
	      console.log('Soap Request Post Err:', error);
	    	deferred.reject(error)
	    }
	    deferred.resolve(body)
	  })
		return deferred.promise;
	}

}