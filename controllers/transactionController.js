var nseApi = require('./../modules/nse-api'),
		Helpers = require('./../modules/helpers'),
		util = require('./../modules/nse-api/util'),
		mailer = require('./../modules/mailer')
		Q = require('q');

var _NSE_Transaction = new nseApi.Transaction(nse_env);
var _NSE_ApiObjectBuilder = new nseApi.APIObjectBuilder(nse_env);
var dataHandler = nseApi.JSONXMLHandler;

// exports.getIINs = function(req, res, next) {
//  	console.log('getIINs')
//  	// var _postData = Helpers.preparePostRequestData(req.decoded)
// 	// var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
//  	Q.all([
//  		// _NSE_Transaction.getIINs(postData),
// 		db.getIINs(req.body)
// 	])
// 	.then(function(result){
// 		var fromNse_iins = req.body.alliins || [] // fromNse_iins will send client
// 		var fromDb_clients = result[0]		// responds with only all family members mapped-unmapped iins

// 		var mapping = util.mapIINtoFamilyMember(fromNse_iins,fromDb_clients) // (fromNse_iins,fromDb_clients) - global iin list matching
// 	 	// console.log("matched=insert+update")
// 		console.log("matched.insert: ",mapping.insert.length)
// 		console.log("matched.update: ",mapping.update.length)
// 	 	if(mapping.insert.length>0 || mapping.update.length>0){ // Found Some
//       // get token if available 
//       // check header or url parameters or post parameters for token
// 	  	var token = req.body.authtoken || req.query.token || req.headers['x-access-token'];
//       Helpers.decodeAuth(token)
//       .then(function(tokenResult){
// 	  		console.log("get token if available ",tokenResult)
// 	  		var credentials=(tokenResult.success)? tokenResult.decoded : null;
// 	  		console.log("after")
//   			Q.all([
//   				db.insertIINsMapping(mapping.insert,credentials),
//   				db.updateIINsMapping(mapping.update,credentials)
//   			])
//   			.then(function(operationalResult){
//   				console.log("Both calls done")
//   				if(operationalResult[0].success){
// 			 			db.getIINs(req.body)
// 			 			.then(function(fromDb){
// 			 				console.log("fromDb",fromDb.length)
// 			 				var send = _.reject(fromDb,{tp_nse_family_iin_mapping_id:null,iin:null})
// 			 				res.send({
// 			 					'matched':send,
// 			 					'unmatched':mapping.unmatched
// 			 				})
// 			 			})
// 			 		}else{
// 		 				res.send(operationalResult)
// 			 		}
//   			})

//       })

// 	 	}else{  // Not Found
// 	 		db.getIINs(req.body)
//  			.then(function(fromDb){
//  				console.log("fromDb",fromDb.length)
//  				var send = _.reject(fromDb,{tp_nse_family_iin_mapping_id:null,iin:null})
//  				res.send({
//  					'matched':send,
//  					'unmatched':mapping.unmatched
//  				})
//  			})
// 	 	}

//  })
// };
exports.getAllIINs = function(req, res, next) {
 	console.log('getAllIINs')
 	var _postData = Helpers.preparePostRequestData(req.decoded)
	var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
 	_NSE_Transaction.getIINs(postData)
	.then(function(xmlResponse){
		dataHandler.xmlTojson(xmlResponse)
    .then(function(toJson){
      var _data = toJson.DataSet['diffgr:diffgram'].NMFIISERVICES
      if(_data.service_status.service_return_code==0){ // Valid Crendentials !
      	res.send({
					'alliins':_data.service_response
				})
      }else{ // Invalid Crendentials !
        res.json({
          success: false,
          alliins: []
        })
      }
    })
	})
};
exports.getFilteredIINs = function(req, res, next) {
 	console.log('getFilteredIINs')
 	db.getIINs(req.body)
	.then(function(result){
		var fromNse_iins = req.body.alliins || [] // fromNse_iins will send client
		var fromDb_clients = result		// responds with only all family members mapped-unmapped iins
		var mapping = util.mapIINtoFamilyMember(fromNse_iins,fromDb_clients) // (fromNse_iins,fromDb_clients) - global iin list matching
	 	
	 	var send = _.reject(fromDb_clients,{tp_nse_family_iin_mapping_id:null,iin:null})
		var remappingReequired=
			(mapping.insert.length>0 || mapping.update.length>0)?
				true:false;
		res.send({
			'matched':send,
			'unmatched':mapping.unmatched,
			'remappingReequired':remappingReequired
		})
	})
};
exports.getIINDetails = function(req, res, next) {
 	console.log('getIINDetails')
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	/* ----- additional required ----- */
 	_postData.iin = req.body.iin // recieve from req.
 	/* ----- additional required end ----- */
 	var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
 	_NSE_Transaction.getIINDetails(postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.service_response
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getIINBankDetails = function(req, res, next) {
 	console.log('getIINBankDetails')
 	var _postData = Helpers.preparePostRequestData(req.decoded);
	/* ----- additional required ----- */
 	 _postData.iin = req.body.iin // recieve from req.
 	/* ----- additional required end ----- */
 	var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
 	_NSE_Transaction.getIINBankDetails(postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.service_response
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getIINModificationStatus = function(req, res, next) {
 	console.log('getIINModificationStatus')
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	/* ----- additional required ----- */
 	_postData.iin = req.body.iin // recieve from req.
 	/* ----- additional required end ----- */
 	var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
 	_NSE_Transaction.getIINModificationStatus(postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.service_response
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getTransactionReverseFeed = function(req, res, next) {
 	console.log('getTransactionReverseFeed')
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	/* ----- additional required ----- */
 	_postData.iin = req.body.iin // recieve from req.
 	_postData.from_date = req.body.from_date
 	_postData.to_date = req.body.to_date
 	_postData.unique_no = req.body.unique_no // Optional

 	var otherTrxnFeeds = _postData
 	var stpTrxnFeeds = _.clone(_postData)
 	delete stpTrxnFeeds.iin
	stpTrxnFeeds.cust_id = req.body.iin
	stpTrxnFeeds.report_type = "STP"
	stpTrxnFeeds.ceased_trxn = "N"
	stpTrxnFeeds.fromdate = req.body.from_date
	stpTrxnFeeds.todate = req.body.to_date
	stpTrxnFeeds.unique_no = req.body.unique_no

 	var currentClientTime = new Date(req.body.last_update_datetime)
 	/* ----- additional required end ----- */
 	var postData_other = Helpers.toXmlWrap(dataHandler.jsonToxml(otherTrxnFeeds))
 	var postData_stp = Helpers.toXmlWrap(dataHandler.jsonToxml(stpTrxnFeeds))

 	Q.all([
 		_NSE_Transaction.getTransactionReverseFeed(postData_other),
		_NSE_Transaction.getTransactionSystematicReverseFeed(postData_stp)
	])
	.then(function(result){
		Q.all([
			dataHandler.xmlTojson(result[0]),
			dataHandler.xmlTojson(result[1])
		])
		.then(function(jsonResult){
			console.log("jsonResult[0]",jsonResult[0].NMFIISERVICES.service_response.length)
			console.log("jsonResult[1]",jsonResult[1].NMFIISERVICES.service_response.length)
			
      var otherResponse=(typeof jsonResult[0].NMFIISERVICES.service_response.length=="undefined")? [] : jsonResult[0].NMFIISERVICES.service_response;
      var systematicResponse=(typeof jsonResult[1].NMFIISERVICES.service_response.length=="undefined")? [] : jsonResult[1].NMFIISERVICES.service_response;

			console.log("otherResponse",otherResponse.length)
			console.log("systematicResponse",systematicResponse.length)
      var _data = otherResponse.concat(parseSTPFeedResponse(systematicResponse))
      console.log(_data.length)
      var _toJson = {
        "status":Helpers.verifyResponse(jsonResult[0].NMFIISERVICES)+" | "+Helpers.verifyResponse(jsonResult[1].NMFIISERVICES),
        "data":_data
      }
      if(otherResponse.length>0){ // if data found then update
        db.updateTransaction(jsonResult[0].NMFIISERVICES.service_response,currentClientTime)
      }
      if(systematicResponse.length>0){ // if data found then update
        db.updateTransaction(jsonResult[1].NMFIISERVICES.service_response,currentClientTime)
      }
			res.send(_toJson)
		},function(error){
	 		res.send(error)
	 	})
	},function(error){
 		res.send(error)
 	})

	function parseSTPFeedResponse(data){
		_.forEach(data,function(o){
			o.REF_NO=o.AUTO_TRXN_NO
			o.PAYMENT_REF_NO=o.UNIQUE_REF_NO
		  o.INVESTOR_IIN=o.CUSTOMER_ID
		  o.TRXN_TYPE=o.AUTO_TRXN_TYPE
		})
		return data
	}
 	// _NSE_Transaction.getTransactionReverseFeed(postData)
 	// 	.then(function(xmlResponse){
 	// 		dataHandler.xmlTojson(xmlResponse)
 	// 			.then(function(toJson){
 	// 				var _data = toJson.NMFIISERVICES
 	// 				var _toJson = {
 	// 					"status":Helpers.verifyResponse(_data),
 	// 					"data":_data.service_response
 	// 				}
 	// 				if(typeof _data.service_response.return_msg=="undefined"){ // if data found then update
 	// 					db.updateTransaction(_data.service_response,currentClientTime)
 	// 				}
 	// 				res.send(_toJson)
 	// 			},function(error){
 	// 				res.send(error)
 	// 			})
 	// 	},function(error){
 	// 		res.send(error)
 	// 	})
};
exports.getACHMandateReport = function(req, res, next) {
 	console.log('getACHMandateReport')
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	/* ----- additional required ----- */
 	var cust_id = req.body.cust_id || ""; // recieve from req.
 	var ach_fromdate = req.body.ach_fromdate || ""; // recieve from req.
 	var ach_todate = req.body.ach_todate || ""; // recieve from req.

 	if(cust_id=="" && 
 			(ach_fromdate=="" && ach_todate=="") ){ // Dates are Mandatory if Customer ID not given.
 		res.status(403).send({
 			error:"ach_fromdate & ach_todate are Mandatory if Customer ID not given."
 		})
 	}
 	_postData.ach_fromdate = ach_fromdate
 	_postData.ach_todate = ach_todate
 	_postData.cust_id = cust_id // 5011000029
 	/* ----- additional required end ----- */
 	var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
 	_NSE_Transaction.getACHMandateReport(postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.service_response
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getADDLBankMandateReport = function(req, res, next) {
 	console.log('getADDLBankMandateReport')
 	var _postData = Helpers.preparePostRequestData(req.decoded);
	/* ----- additional required ----- */
 	_postData.cust_id = req.body.cust_id // recieve from req.
 	/* ----- additional required end ----- */
 	var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
 	_NSE_Transaction.getADDLBankMandateReport(postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.service_response
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getIINTransactions = function(req, res, next){
	console.log('getIINTransactions')
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	/* ----- additional required ----- */
 	_postData.iin = req.body.iin // recieve from req.
 	/* ----- additional required end ----- */
 	var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
 	_NSE_Transaction.getIINTransactions(postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.DataSet['diffgr:diffgram'].NMFIISERVICES
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.service_response
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};

/* ------------- Purchase ------------- */
exports.purchaseTransaction = function(req, res, next) {
 	console.log('purchaseTransaction')
 	/* ----- prepare data ----- */
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	var _object = _NSE_ApiObjectBuilder.purchaseObject(req.body)
 	_.extend(_postData,_object.postData)
 	var Transactions = [];
 	console.log("transactions length",_object.transactions.length)
 	Transactions = _object.transactions
 	
 	/* ----- prepare data end ----- */
 	var _serviceRequest = dataHandler.jsonToxml(_postData)
 	var _transactions = dataHandler.jsonToxmlForTransactions(Transactions)
 	var postData = Helpers.toXmlWrap(_serviceRequest+_transactions)
 	console.log('url : ',_object.url)
 	console.log('postData : ',postData)
 	_NSE_Transaction.purchaseTransaction(_object.url,postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					if(Helpers.verifyTransactionResponse(_data)){
 						// success - insert a record in transaction db
 						db.insertTransaction(_data,req.body)
 						.then(function(dbResult){
		 					var _toJson = {
		 						"status":_data.service_status,
		 						"dbstatus":dbResult,
		 						"data":_data.service_response
		 					}
		 					if(req.body.data.payment_mode!='M'){
			 					if(req.body.extras.sip_via_purchase){
			 						mailer.sendSIPMail(req.body,_data.service_response)
			 					}else{
			 						mailer.sendPurchaseMail(req.body,_data.service_response)
			 					}
		 					}
		 					res.status(200).send(_toJson)
 						})
 					}else{
 						console.log('Something goes wrong with transaction execution !')
 						var error={
 							"status":"Something goes wrong with transaction execution !",
 							"data":_data.service_response
 						}
 						res.status(400).send(error)
 					}
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
/* ------------- Purchase ------------- */

/* ------------- Redemption ------------- */
exports.redemptionTransaction = function(req, res, next) {
 	console.log('redemptionTransaction')
 	/* ----- prepare data ----- */
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	var _object = _NSE_ApiObjectBuilder.redemptionObject(req.body)
 	_.extend(_postData,_object.postData)
 	var Transactions = [];
 	Transactions = _object.transactions
 	
 	/* ----- prepare data end ----- */
 	
 	var _serviceRequest = dataHandler.jsonToxml(_postData)
 	var _transactions = dataHandler.jsonToxmlForTransactions(Transactions)
 	var postData = Helpers.toXmlWrap(_serviceRequest+_transactions)
 	console.log('url : ',_object.url)
 	console.log('postData : ',postData)
 	_NSE_Transaction.redemptionTransaction(_object.url,postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					if(Helpers.verifyTransactionResponse(_data)){
 						// success - insert a record in transaction db
 						db.insertTransaction(_data,req.body)
 						.then(function(dbResult){
		 					var _toJson = {
		 						"status":_data.service_status,
		 						"dbstatus":dbResult,
		 						"data":_data.service_response
		 					}
		 					res.status(200).send(_toJson)
 						})
 					}else{
 						console.log('Something goes wrong with transaction execution !')
 						var error={
 							"status":"Something goes wrong with transaction execution !",
 							"data":_data.service_response
 						}
 						res.status(400).send(error)
 					}
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
/* ------------- Redemption ------------- */

/* ------------- Switch ------------- */
exports.switchTransaction = function(req, res, next) {
 	console.log('switchTransaction')
 	/* ----- prepare data ----- */
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	var _object = _NSE_ApiObjectBuilder.switchObject(req.body)
 	_.extend(_postData,_object.postData)
 	var Transactions = [];
 	Transactions = _object.transactions
 	
 	/* ----- prepare data end ----- */

 	var _serviceRequest = dataHandler.jsonToxml(_postData)
 	var _transactions = dataHandler.jsonToxmlForTransactions(Transactions)
 	var postData = Helpers.toXmlWrap(_serviceRequest+_transactions)
 	console.log('url : ',_object.url)
 	console.log('postData : ',postData)
 	_NSE_Transaction.switchTransaction(_object.url,postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					if(Helpers.verifyTransactionResponse(_data)){
 						// success - insert a record in transaction db
 						db.insertTransaction(_data,req.body)
 						.then(function(dbResult){
		 					var _toJson = {
		 						"status":_data.service_status,
		 						"dbstatus":dbResult,
		 						"data":_data.service_response
		 					}
		 					res.status(200).send(_toJson)
 						})
 					}else{
 						console.log('Something goes wrong with transaction execution !')
 						var error={
 							"status":"Something goes wrong with transaction execution !",
 							"data":_data.service_response
 						}
 						res.status(400).send(error)
 					}
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
/* ------------- Switch ------------- */

/* ------------- Systematic ------------- */
exports.systematicTransaction = function(req, res, next) {
 	console.log('systematicTransaction')
 	/* ----- prepare data ----- */
 	var _postData = Helpers.preparePostRequestData(req.decoded)
 	var _object = _NSE_ApiObjectBuilder.systematicObject(req.body)
 	_.extend(_postData,_object.postData)
 	var Transactions = [];
 	Transactions = _object.transactions
 	
 	/* ----- prepare data end ----- */

 	var _serviceRequest = dataHandler.jsonToxml(_postData)
 	var _transactions = dataHandler.jsonToxmlForTransactions(Transactions)
 	var postData = Helpers.toXmlWrap(_serviceRequest+_transactions)
 	console.log('url : ',_object.url)
 	console.log('postData : ',postData)
 	_NSE_Transaction.systematicTransaction(_object.url,postData)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NMFIISERVICES
 					if(Helpers.verifyTransactionResponse(_data)){
 						// success - insert a record in transaction db
 						db.insertTransaction(_data,req.body)
 						.then(function(dbResult){
		 					var _toJson = {
		 						"status":_data.service_status,
		 						"dbstatus":dbResult,
		 						"data":_data.service_response
		 					}
		 					switch(req.body.extras.systematic_sub_transaction_type){
		 						case "SIP": mailer.sendSIPMail(req.body,_data.service_response);break;
		 						case "STP": break;
		 						case "SWP": break;
		 					}
		 					res.status(200).send(_toJson)
 						})
					}else{
 						console.log('Something goes wrong with transaction execution !')
 						var error={
 							"status":"Something goes wrong with transaction execution !",
 							"data":_data.service_response
 						}
 						res.status(400).send(error)
 					}
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
/* ------------- Systematic ------------- */