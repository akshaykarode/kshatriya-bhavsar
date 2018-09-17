var Q = require('q'),
		soapRequest = require('./soapRequest');

function NSE_Master(nse_env){
	nseConfig = require('./../../configs/nse-config.json')[nse_env]
  return this
}

/* --- API Methods ---
GET  - AccountType
GET  - HoldingNature
GET  - Occupation
GET  - Country
GET  - Bank
GET  - State
POST - City 	| body:{StateCode:''}
GET  - Tax
GET  - Location
GET  - Amc
POST - Product   | body:{AmcCode:''} | API docs given wrong-Amc_code
GET  - TransactionType
GET  - PaymentMechanism
POST - ProductLimit   | body:{AmcCode:''} | API docs given wrong-Amc_code
GET  - PANExemptCategory
GET  - BillDeskBank
GET  - ApplicableIncome
GET  - SourceWealth
GET  - IDType
GET  - ActiveNFE
GET  - Exemption
GET  - GIINExemption
GET  - UBO
POST - Pincode 	| body:{City:''}
*/

NSE_Master.prototype.getAccountTypeMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/AccountType?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getHoldingNatureMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/HoldingNature?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getOccupationMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Occupation?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getCountryMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Country?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getBankMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Bank?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getStateMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/State?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getCityMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/City?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getTaxMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Tax?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getLocationMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Location?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getAmcMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Amc?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getProductMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Product?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getTransactionTypeMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/TransactionType?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getPaymentMechanismMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/PaymentMechanism?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getProductLimitMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/ProductLimit?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getPANExemptCategoryMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/PANExemptCategory?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getBillDeskBankMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/BillDeskBank?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getApplicableIncomeMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/ApplicableIncome?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getSourceWealthMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/SourceWealth?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getIDTypeMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/IDType?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getActiveNFEMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/ActiveNFE?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getExemptionMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Exemption?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getGIINExemptionMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/GIINExemption?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getUBOMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/UBO?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}
NSE_Master.prototype.getPincodeMaster = function(query){
	var deferred = Q.defer();
	var url = nseConfig.masterListUrl+"/Pincode?"+query;
	soapRequest.get(url)
		.then(function(xmlResponse){
			var str = xmlResponse.match(new RegExp(nseConfig.masterResponseRegx))
			deferred.resolve(str[0])
		},function(error){
			deferred.reject(error)
		})
	return deferred.promise;
}

module.exports = NSE_Master;