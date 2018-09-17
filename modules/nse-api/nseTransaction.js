var Q = require('q'),
		soapRequest = require('./soapRequest');

function NSE_Transaction(nse_env){
  nseConfig = require('./../../configs/nse-config.json')[nse_env]
  return this
}

/* --- API Methods ---

[*] POST  -  | 1.5.9 Get All IIN Details 
[*] POST  -  | 1.5.2 Get IIN Details 
[*] POST  -  | 1.5.12 IIN Modification Status 
[*] POST  -  | 1.5.8 Get IIN Transaction Reverse Feed 
[*] POST  -  | 1.5.14 ACH Mandate Report 

[*] POST  -  | 1.5.3 Purchase Transaction 
[*] POST  -  | 1.5.4 Redemption Transaction 
[*] POST  -  | 1.5.5 Switch Transaction 
[*] POST  -  | 1.5.6 Systematic Transaction
 
[x] POST  -  | 1.5.1 Create customer 
[x] POST  -  | 1.5.7 Cease the Systematic Transaction 
[x] POST  -  | 1.5.10 FATCA / KYC / UBO Registration 
[x] POST  -  | 1.5.11 Edit Customer Details 
[x] POST  -  | 1.5.13 ACH Mandate Registration 
[x] POST  -  | 1.5.15 Systematic Cease Report 
[x] POST  -  | 1.5.16 Systematic Registration Report 
[x] POST  -  | 1.5.17 Get IIN 

*/

NSE_Transaction.prototype.getIINs = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/ALLIINDETAILS";
	console.log("url : ",url)
	console.log("xmlData : ",xmlData)
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			console.log("RegExp",new RegExp(nseConfig.transactionResponseRegx))
			// console.log("xmlResponse came",JSON.stringify(xmlResponse))
			// var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			// console.log("regex done")
			// console.log(str)
			// deferred.resolve(str[0])
			deferred.resolve(xmlResponse)
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getIINDetails = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/IINDETAILS";
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getIINModificationStatus = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/IINMODIFICATIONSTATUS";
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getIINBankDetails = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/IINBANKDETAILS";
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getTransactionReverseFeed = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/TRXNREVERSEFEED";
	console.log("url:",url)
	console.log("xmlData:",xmlData)
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getTransactionSystematicReverseFeed = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/SYSREGISTRATIONSREPORT";
	console.log("url:",url)
	console.log("xmlData:",xmlData)
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getACHMandateReport = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/ACHMANDATEREPORT";
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getADDLBankMandateReport = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.transactionUrl+"/ADDLBANKMANDATEREPORT";
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.getIINTransactions = function(xmlData){
	var deferred = Q.defer();
	var url = nseConfig.holdingDetailsUrl+"/IINTRXNINFO";
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			deferred.resolve(xmlResponse)
			// deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}

NSE_Transaction.prototype.purchaseTransaction = function(url,xmlData){
	var deferred = Q.defer();
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.redemptionTransaction = function(url,xmlData){
	var deferred = Q.defer();
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.switchTransaction = function(url,xmlData){
	var deferred = Q.defer();
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Transaction.prototype.systematicTransaction = function(url,xmlData){
	var deferred = Q.defer();
	soapRequest.post(url,xmlData)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.transactionResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
module.exports = NSE_Transaction;