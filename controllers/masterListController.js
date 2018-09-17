var nseApi = require('./../modules/nse-api'),
		Helpers = require('./../modules/helpers')

var _NSE_Master = new nseApi.Master(nse_env);
var dataHandler = nseApi.JSONXMLHandler;

exports.getAccountTypeMaster = function(req, res, next) {
 	console.log('getAccountTypeMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getAccountTypeMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.account_type
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getHoldingNatureMaster = function(req, res, next) {
 	console.log('getHoldingNatureMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getHoldingNatureMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.holding_nature
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getOccupationMaster = function(req, res, next) {
 	console.log('getOccupationMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getOccupationMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.occupation_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getCountryMaster = function(req, res, next) {
 	console.log('getCountryMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getCountryMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.country_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getBankMaster = function(req, res, next) {
 	console.log('getBankMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	console.log("getBankMaster",defaultParams)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getBankMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.bank_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getStateMaster = function(req, res, next) {
 	console.log('getStateMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getStateMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.state_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getCityMaster = function(req, res, next) {
 	console.log('getCityMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var extraParams = req.body
	var queryParams = Helpers.toQueryParams(defaultParams,extraParams)
 	_NSE_Master.getCityMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status": Helpers.verifyResponse(_data),
 						"data":_data.city_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getTaxMaster = function(req, res, next) {
 	console.log('getTaxMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getTaxMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.tax_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getLocationMaster = function(req, res, next) {
 	console.log('getLocationMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getLocationMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.mfd_location
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getAmcMaster = function(req, res, next) {
 	console.log('getAmcMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getAmcMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.amc_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getProductMaster = function(req, res, next) {
 	console.log('getProductMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var extraParams = req.body
 	var queryParams = Helpers.toQueryParams(defaultParams,extraParams)
 	_NSE_Master.getProductMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.product_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getTransactionTypeMaster = function(req, res, next) {
 	console.log('getTransactionTypeMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getTransactionTypeMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.transaction_types_master
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getPaymentMechanismMaster = function(req, res, next) {
 	console.log('getPaymentMechanismMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getPaymentMechanismMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.payment_mechanism
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getProductLimitMaster = function(req, res, next) {
 	console.log('getProductLimitMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
	var extraParams = req.body
 	var queryParams = Helpers.toQueryParams(defaultParams,extraParams)
 	_NSE_Master.getProductLimitMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.product_limit
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getPANExemptCategoryMaster = function(req, res, next) {
 	console.log('getPANExemptCategoryMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getPANExemptCategoryMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.pan_exempt_category
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getBillDeskBankMaster = function(req, res, next) {
 	console.log('getBillDeskBankMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getBillDeskBankMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.BILLDESK_MASTER
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getApplicableIncomeMaster = function(req, res, next) {
 	console.log('getApplicableIncomeMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getApplicableIncomeMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.Applicable_Income
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getSourceWealthMaster = function(req, res, next) {
 	console.log('getSourceWealthMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getSourceWealthMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.SourceWealth
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getIDTypeMaster = function(req, res, next) {
 	console.log('getIDTypeMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getIDTypeMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.IentificationType
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getActiveNFEMaster = function(req, res, next) {
 	console.log('getActiveNFEMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getActiveNFEMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.ActiceNFE
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getExemptionMaster = function(req, res, next) {
 	console.log('getExemptionMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getExemptionMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.Exemption
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getGIINExemptionMaster = function(req, res, next) {
 	console.log('getGIINExemptionMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getGIINExemptionMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.GIINExemption
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getUBOMaster = function(req, res, next) {
 	console.log('getUBOMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
 	var queryParams = Helpers.toQueryParams(defaultParams)
 	_NSE_Master.getUBOMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":_data.service_status,
 						"data":_data.UBO_MASTER
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};
exports.getPincodeMaster = function(req, res, next) {
 	console.log('getPincodeMaster')
 	var defaultParams = Helpers.prepareGetRequestParams(req.decoded,true)
	var extraParams = req.body
 	var queryParams = Helpers.toQueryParams(defaultParams,extraParams)
 	_NSE_Master.getPincodeMaster(queryParams)
 		.then(function(xmlResponse){
 			dataHandler.xmlTojson(xmlResponse)
 				.then(function(toJson){
 					var _data = toJson.NewDataSet
 					// console.log(_data)
 					var _toJson = {
 						"status":Helpers.verifyResponse(_data),
 						"data":_data.pincode
 					}
 					res.send(_toJson)
 				},function(error){
 					res.send(error)
 				})
 		},function(error){
 			res.send(error)
 		})
};