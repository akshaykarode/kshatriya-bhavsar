var Connection = require('./connection');
var _ = require('lodash')
var _request = require('request')
var forEach = require('async-foreach').forEach;
var dbData = require('./static.json')[process.argv[3] || "LIVE"]
// var dbConfig = require('../../configs/default')[ENV].db
var xml2js = require('xml2js'),
		parseString = xml2js.parseString,
		Helpers = require('./../helpers'),
		util = require('./../nse-api/util'),
		Q = require('q');
var nseApi = require('../nse-api'),
		nseMaster = new nseApi.Master(process.argv[3] || "LIVE");
var dataHandler = nseApi.JSONXMLHandler;
var _NSE_Transaction = new nseApi.Transaction(process.argv[3] || "LIVE");
var parseStringOptions={
	"explicitArray":false,
	"ignoreAttrs":true
}

function xmlTojson(xmldata){
	var deferred = Q.defer();
	parseString(xmldata,parseStringOptions,function(err,result){
		if(!err){
			deferred.resolve(result)
		}else{
			console.log(err)
			deferred.reject(new Error("xmlTojson failed."))
		}
	});
	return deferred.promise;
}

function Database(dbConfig) {
  this.connection = new Connection(dbConfig)
  console.log("DB CONSOLE Initiated Successfully.")
	return this;
}

/* node console :
var ENV = '<ENV>'
var db = require('./db-console.js')
*/
Database.prototype.resetAmcMaster = function() {
	var deferred = Q.defer();
	this.connection.acquire(function(err, con) {
		con.query('TRUNCATE TABLE tp_nse_amc_master', function(err, result) {
			console.log('tp_nse_amc_master truncated.')
			console.log('fetch amc master')
			nseMaster.getAmcMaster(dbData.credentials[0])
			.then(function(xmlResponse){
				console.log('parsing ... ');
				xmlTojson(xmlResponse)
					.then(function(toJson){
						var _data = toJson.NewDataSet
						var arr = (_data.amc_master[0])? _data.amc_master : [_data.amc_master];
			 			var _valuesData=[]
						for(var i=0;i<arr.length;i++){
							_valuesData[i] = _.values({
								"amc_code":arr[i].AMC_CODE || "",
								"long_name":arr[i].LONG_NAME || ""
							});
					  }
						console.log('inserting ... ',_valuesData.length);
					  con.query('INSERT INTO tp_nse_amc_master (amc_code,long_name) VALUES ?',[_valuesData],function(err, result) {
						  console.log(err);
						  if(err){
						  	console.log('err-prone values',_valuesData)
						  	deferred.resolve({success:false,error:err})
						  }
							console.log('tp_nse_amc_master fullfilled.')
						  deferred.resolve({success:true})
						})
					})
				})
		})
	})
	return deferred.promise;
}

Database.prototype.resetSchemeLimitMaster = function() {
	var deferred = Q.defer();
	this.connection.acquire(function(err, con) {
		con.query('TRUNCATE TABLE tp_nse_product_limit_master', function(err, result) {
			console.log('tp_nse_product_limit_master truncated.')
			// fetch each amc product limit & dump into db
			nseMaster.getAmcMaster(dbData.credentials[0])
			.then(function(xmlResponse){
				console.log('parsing ... ');
				xmlTojson(xmlResponse)
					.then(function(toJson){
						var _data = toJson.NewDataSet
						var arr = (_data.amc_master[0])? _data.amc_master : [_data.amc_master];
						forEach(arr,function(singleAmc,index){
							console.log('AMC :',singleAmc.AMC_CODE);
							var done=this.async()
							console.log('fetch product_limit master :',singleAmc.AMC_CODE);
							forEach(dbData.credentials,function(credential){
								var done1=this.async()
								nseMaster.getProductLimitMaster(credential+'&AmcCode='+singleAmc.AMC_CODE)
								.then(function(xmlResponse){
									console.log('parsing ... ');
									xmlTojson(xmlResponse)
					 				.then(function(toJson){
					 					var _data = toJson.NewDataSet
					 					if(_data.service_status.service_return_code=='0'){
						 					var arr = (_data.product_limit[0])? _data.product_limit : [_data.product_limit];
						 					var _valuesData=[]
						 					for(var i=0;i<arr.length;i++){
												_valuesData[i] = _.values({
													"registrar_id":arr[i].REGISTRAR_ID || "",
													"amc_code":arr[i].AMC_CODE || "",
													"product_long_name":arr[i].PRODUCT_LONG_NAME || "",
													"product_code":arr[i].PRODUCT_CODE || "",
													"trxn_type":arr[i].TRXN_TYPE || "",
													"sub_trxn_type":arr[i].SUB_TRXN_TYPE || "",
													"sub_trxn_type_desc":arr[i].SUB_TRXN_TYPE_DESC || "",
													"minimum_amount":arr[i].MINIMUM_AMOUNT || "",
													"maximum_amount":arr[i].MAXIMUM_AMOUNT || "",
													"min_units":arr[i].MIN_UNITS || "",
													"multiples":arr[i].MULTIPLES || "",
													"min_installment_months":arr[i].MIN_INSTALLMENT_MONTHS || "",
													"last_modified_date":(arr[i].LAST_MODIFIED_DATE!="")? new Date(arr[i].LAST_MODIFIED_DATE) : null,
												});
										  }
											console.log('inserting ... ',_valuesData.length);
										  con.query('INSERT INTO tp_nse_product_limit_master (registrar_id,amc_code,product_long_name,product_code,trxn_type,sub_trxn_type,sub_trxn_type_desc,minimum_amount,maximum_amount,min_units,multiples,min_installment_months,last_modified_date) VALUES ?',[_valuesData],function(err, result) {
											  console.log(err);
											  if(err){
											  	console.log('err-prone values',_valuesData)
											  }
												console.log('tp_nse_product_limit_master for '+singleAmc.AMC_CODE+' fullfilled.')
												done1()
											})
					 					}else{
					 						console.log('something went wrong for : '+singleAmc.AMC_CODE+' : ',toJson)
					 						done1()
					 					}
					 				},function(error){
					 					res.send(error)
					 				})

								})
							},function(){
								done()
							})
						},function(){ // alldone
							console.log('alldone');
							deferred.resolve({success:true})
							con.release();
						})
					})
				})
		})
	});
	return deferred.promise;
}

Database.prototype.resetSchemeMaster = function() {
	var deferred = Q.defer();
	this.connection.acquire(function(err, con) {
		con.query('TRUNCATE TABLE tp_nse_product_master', function(err, result) {
			console.log('tp_nse_product_master truncated.')
			// fetch each amc product & dump into db
			nseMaster.getAmcMaster(dbData.credentials[0])
			.then(function(xmlResponse){
				console.log('parsing ... ');
				xmlTojson(xmlResponse)
					.then(function(toJson){
						var _data = toJson.NewDataSet
						var arr = (_data.amc_master[0])? _data.amc_master : [_data.amc_master];
						forEach(arr,function(singleAmc,index){
							console.log('AMC :',singleAmc.AMC_CODE);
							var done=this.async()
							console.log('fetch product master :',singleAmc.AMC_CODE);
							forEach(dbData.credentials,function(credential){
								var done1=this.async()
								nseMaster.getProductMaster(credential+'&AmcCode='+singleAmc.AMC_CODE)
								.then(function(xmlResponse){
									console.log('parsing ... ');
									xmlTojson(xmlResponse)
					 				.then(function(toJson){
					 					var _data = toJson.NewDataSet
					 					if(_data.service_status.service_return_code=='0'){
						 					var arr = (_data.product_master[0])? _data.product_master : [_data.product_master];
						 					var _valuesData=[]
						 					for(var i=0;i<arr.length;i++){
												_valuesData[i] = _.values({
													"amc_code":arr[i].AMC_CODE || "",
													"product_code":arr[i].PRODUCT_CODE || "",
													"product_long_name":arr[i].PRODUCT_LONG_NAME || "",
													"systematic_frequencies":arr[i].SYSTEMATIC_FREQUENCIES || "",
													"purchase_allowed":arr[i].PURCHASE_ALLOWED || "",
													"switch_allowed":arr[i].SWITCH_ALLOWED || "",
													"redemption_allowed":arr[i].REDEMPTION_ALLOWED || "",
													"sip_allowed":arr[i].SIP_ALLOWED || "",
													"stp_allowed":arr[i].STP_ALLOWED || "",
													"swp_allowed":arr[i].SWP_ALLOWED || "",
													"sip_dates":arr[i].SIP_DATES || "",
													"stp_dates":arr[i].STP_DATES || "",
													"swp_dates":arr[i].SWP_DATES || "",
													"product_category":arr[i].PRODUCT_CATEGORY || "",
													"reinvest_tag":arr[i].REINVEST_TAG || "",
													"isin":arr[i].ISIN || "",
													"active_flag":arr[i].ACTIVE_FLAG || "",
													"asset_class":arr[i].ASSET_CLASS || "",
													"sub_fund_code":arr[i].SUB_FUND_CODE || "",
													"plan_type":arr[i].PLAN_TYPE || "",
													"insurance_enabled":arr[i].INSURANCE_ENABLED || "",
													"rta_code":arr[i].RTA_CODE || "",
													"last_modified_date":(arr[i].LAST_MODIFIED_DATE!="")? new Date(arr[i].LAST_MODIFIED_DATE) : null,
												});
										  }
											console.log('inserting ... ',_valuesData.length);
										  con.query('INSERT INTO tp_nse_product_master (amc_code,product_code,product_long_name,systematic_frequencies,purchase_allowed,switch_allowed,redemption_allowed,sip_allowed,stp_allowed,swp_allowed,sip_dates,stp_dates,swp_dates,product_category,reinvest_tag,isin,active_flag,asset_class,sub_fund_code,plan_type,insurance_enabled,rta_code,last_modified_date) VALUES ?',[_valuesData],function(err, result) {
											  console.log(err);
											  if(err){
											  	console.log('err-prone values',_valuesData)
											  }
												console.log('tp_nse_product_master for '+singleAmc.AMC_CODE+' fullfilled.')
												done1()
											})
					 					}else{
					 						console.log('something went wrong for : '+singleAmc.AMC_CODE+' : ',toJson)
					 						done1()
					 					}
					 				},function(error){
					 					res.send(error)
					 				})

								})
							},function(){
								done()
							})
						},function(){ // alldone
							console.log('alldone');
							deferred.resolve({success:true})
							con.release();
						})
					})
				})
			
		})
	});
	return deferred.promise;
};

Database.prototype.resetBankMaster = function() {
	var deferred = Q.defer();
	var bank,billdeskBank;
	this.connection.acquire(function(err, con) {
    con.query('TRUNCATE TABLE tp_nse_bank_master', function(err, result) {
			console.log('tp_nse_bank_master truncated.')
			nseMaster.getBankMaster(dbData.credentials[0])
			.then(function(xmlResponse){
				console.log('parsing ... ');
				xmlTojson(xmlResponse)
					.then(function(toJson){
						var _data = toJson.NewDataSet
						bank = (_data.bank_master[0])? _data.bank_master : [_data.bank_master];
						nseMaster.getBillDeskBankMaster(dbData.credentials[0])
						.then(function(xmlResponse){
							console.log('parsing ... ');
							xmlTojson(xmlResponse)
								.then(function(toJson){
									var _data = toJson.NewDataSet
									billdeskBank = (_data.BILLDESK_MASTER[0])? _data.BILLDESK_MASTER : [_data.BILLDESK_MASTER];

									var data = [],left=[],_valuesData=[]
									for (var i = 0; i < billdeskBank.length; i++) {
										var o = _.filter(bank, { 'BANK_CODE': billdeskBank[i].BD_BANK_CODE})
										if(o.length>0){
											data.push({
												"bd_bank_code":billdeskBank[i].BD_BANK_CODE,
												"bd_bank_name":billdeskBank[i].BD_BANK_NAME,
												"activeflag":billdeskBank[i].ACTIVEFLAG,
												"bank_category":billdeskBank[i].BANK_CATEGORY,
												"bank_code":o[0].BANK_CODE,
												"bank_name":o[0].BANK_NAME,
												"last_modified_date":(o[0].LAST_MODIFIED_DATE!="")? new Date(o[0].LAST_MODIFIED_DATE) : null,
											})
										}else{
											left.push({
												"bd_bank_code":billdeskBank[i].BD_BANK_CODE,
												"bd_bank_name":billdeskBank[i].BD_BANK_NAME,
												"activeflag":billdeskBank[i].ACTIVEFLAG,
												"bank_category":billdeskBank[i].BANK_CATEGORY,
												"bank_code":"",
												"bank_name":"",
												"last_modified_date":null,
											})
										}
								  }
								  console.log('data',data.length);
								  console.log('left',left.length);
								  var _data = data.concat(left)
								  for(var i=0;i<_data.length;i++){
										_valuesData[i] = _.values(_data[i]);
								  }
								  console.log('_valuesData',_valuesData[0]);
								  console.log('_valuesData',_valuesData[1]);
								  
						      con.query('INSERT INTO tp_nse_bank_master (bd_bank_code,bd_bank_name,activeflag,bank_category,bank_code,bank_name,last_modified_date) VALUES ?',[_valuesData],function(err, result) {
						      	con.release();
									  console.log(err);
									  if(err){
									  	console.log('err-prone values',_valuesData)
									  	deferred.resolve({success:false,error:err})
									  }
										console.log('tp_nse_bank_master fullfilled.')
									  console.log(result);
									  deferred.resolve({success:true})
									})
								    

							})
						})
					})
				})
	
		});
	});
	return deferred.promise;
};

Database.prototype.updateFamilyIInMapping = function() {
	var deferred = Q.defer();
	/* acc to new schema */
	// var getCredentialQuery=
	// 	'SELECT tm.team_member_id as team_member_session_id,tnc.broker_code,tnc.application_id,tnc.password FROM `tp_nse_credentials` tnc '+
	// 	'INNER JOIN team_members tm '+
	// 	'ON '+
	// 	'tm.admin_advisor_id=tnc.advisor_id '+
	//   'WHERE tnc.broker_code IS NOT NULL  '+
	// 	'GROUP BY tm.team_member_id ';
	
	/* acc to new schema - both credentials */
	var getCredentialQuery=
		'SELECT tm.team_member_id as team_member_session_id, '+
		'tnc.broker_code,tnc.application_id,tnc.password, '+
		'tnc.ria_code,tnc.ria_application_id,tnc.ria_password  '+
		'FROM `tp_nse_credentials` tnc  '+
		'INNER JOIN team_members tm  '+
		'ON  '+
		'tm.admin_advisor_id=tnc.advisor_id  '+
		'WHERE tnc.broker_code IS NOT NULL OR tnc.ria_code IS NOT NULL  '+
		'GROUP BY tnc.broker_code,tnc.ria_code ';


	/* acc to old schema 
	var getCredentialQuery=
		'SELECT c.team_member_session_id,fim.broker_code,fim.application_id,fim.password FROM `tp_nse_family_iin_mapping` fim '+
		'INNER JOIN clients c '+
		'ON '+
		'c.client_id=fim.client_id '+
		'GROUP BY c.team_member_session_id ';
		*/
	console.log("query: ",getCredentialQuery)
	this.connection.acquire(function(err, con) {
		con.query(getCredentialQuery, function(err, credentials) {
			con.release()
			console.log('credentials',credentials)
			forEach(credentials,function(singleCredential,i){
				var login_type=(singleCredential.broker_code!=null)? "arn" : "ria";
				singleCredential={
					'teamMemberSessionId':singleCredential.team_member_session_id,
					'brokerCode':singleCredential.broker_code,
					'applicationId':singleCredential.application_id,
					'password':singleCredential.password,
					'riaCode':singleCredential.ria_code,
					'riaApplicationId':singleCredential.ria_application_id,
					'riaPassword':singleCredential.ria_password,
					'login_type':login_type
				}
				console.log('singleCredential :',singleCredential);
				var done=this.async()
				var _postData = Helpers.preparePostRequestData(singleCredential)
				var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
				var reqData = {
					admin_advisor_id:true,
					teamMemberSessionId:singleCredential.teamMemberSessionId,
					teamHierarchyList:[]
				}
			 	Q.all([
			 		_NSE_Transaction.getIINs(postData),
					db.getIINs(reqData)
				])
				.then(function(result){
					console.log("result appear")
        	dataHandler.xmlTojson(result[0])
          .then(function(toJson){
            var _data = toJson.DataSet['diffgr:diffgram'].NMFIISERVICES
						var fromNse_iins = _data.service_response || [] // fromNse_iins will send client
						var fromDb_clients = result[1]		// responds with only all family members mapped-unmapped iins

						if(_data.service_status.service_return_code=="0"){ // valid credentials/success
							var mapping = util.mapIINtoFamilyMember(fromNse_iins,fromDb_clients) // (fromNse_iins,fromDb_clients) - global iin list matching
							console.log("matched.insert: ",mapping.insert.length)
							console.log("matched.update: ",mapping.update.length)
							if(mapping.insert.length>0 || mapping.update.length>0){ // Found Some
								Q.all([
				  				db.insertIINsMapping(mapping.insert,singleCredential),
				  				db.updateIINsMapping(mapping.update,singleCredential)
				  			])
				  			.then(function(operationalResult){
				  				console.log("Both calls done",operationalResult)
				  				done()
				  			})
						 	}else{
								console.log("no operation.")
								done()
							}
						}else{
							done()
						}

          })
			 	})
			},function(result){ // Alldone
				console.log('updateFamilyIInMapping Done.')
			  deferred.resolve({success:true})
			})
		})
	})
	return deferred.promise;
}

// module.exports = new Database();
module.exports = Database;