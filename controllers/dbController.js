var Q = require('q'),
		_ = require('lodash'),
		forEach = require('async-foreach').forEach,
		Helpers = require('./../modules/helpers')

var nseApi = require('./../modules/nse-api');
var dataHandler = nseApi.JSONXMLHandler
var _NSE_Transaction = new nseApi.Transaction(nse_env);

exports.mapIIN = function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.authtoken || req.query.token || req.headers['x-access-token'];
	Helpers.decodeAuth(token)
  .then(function(tokenResult){
  	console.log("get token if available & insert credentials by db call",tokenResult)
  	var credentials=(tokenResult.success)? tokenResult.decoded : null;
  	var arr=_.isArray(req.body) ? req.body : [req.body]
		db.insertIINsMapping(arr,credentials)
			.then(function(status){
				if(status.success){
					res.status(201).send('IINs Mapped Successfully.')
				}else{
					res.status(400).send(status.error)
				}
			})
  })  	
}
exports.getAllBanks = function(req, res, next) {
	db.getAllBanks(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getAllAmcs = function(req, res, next) {
	db.getAllAmcs(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getEmpanelledAmcs = function(req, res, next) {
	db.getEmpanelledAmcs(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.empanelAmc = function(req, res, next) {
	if(req.body.empanel){
		db.insertEmpanelAmc(req.body)
			.then(function(status){
				if(status.success){
					res.status(201).send({status:'AMC Emplaneled Successfully.',id:status.id})
				}else{
					res.status(400).send(status.error)
				}
			})
	}else{ // Un-Empanel Amc
		if(req.body.tp_nse_empanelled_amc_id){
			db.deleteEmpanelAmc(req.body)
				.then(function(status){
					if(status.success){
						if(status.data.affectedRows!=0)
							res.status(200).send('AMC Un-Emplaneled Successfully.')
						else
							res.status(304).send('DB Not Affected.')
					}else{
						res.status(400).send(status.error)
					}
				})
		}else{
			res.status(400).send('Bad Arguments')
		}
	}
}
exports.searchSchemes = function(req, res, next) {
	var pm_query = '',plm_query = 'minimum_amount<100000000 AND ';
	switch(req.params.type){
		case 'purchase': 
					// pm_query='AND purchase_allowed = "Y" '
					// plm_query='trxn_type = "FP" AND ''
					pm_query='AND sip_allowed = "Y" '
					plm_query=''
					break;
		case 'redemption': 
					pm_query=''
					plm_query = ''
					break;
		case 'sip': 
					pm_query='AND sip_allowed = "Y" '
					plm_query=''
					break;
		case 'swp': 
					pm_query=''
					plm_query = ''
					break;
		case 'stp': 
					pm_query='AND (stp_allowed = "Y" OR stp_allowed = "B" OR stp_allowed = "I") '
					plm_query=''
					break;
		case 'switch': 
					pm_query='AND switch_allowed = "Y" '
					plm_query='trxn_type = "FP" AND '
					break;
	}
	db.searchSchemes(req.body,pm_query,plm_query)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.searchCategorizedSchemes = function(req, res, next) {
	db.searchCategorizedSchemes(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getExistingSchemes = function(req, res, next) {
	var pm_query = '',plm_query = 'minimum_amount<100000000 AND ';
	switch(req.params.type){
		case 'purchase': 
					pm_query='tnpm.purchase_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "AP" AND '
					break;
		case 'redemption': 
					pm_query='tnpm.redemption_allowed = "Y" AND '
					plm_query = '(tnplm.trxn_type = "R" AND tnplm.sub_trxn_type = "N") AND '
					break;
		case 'sip': 
					pm_query='tnpm.sip_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "SI" AND '
					break;
		case 'swp': 
					pm_query='tnpm.swp_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "SI" AND '
					break;
		case 'stp': 
					pm_query='(tnpm.stp_allowed = "Y" OR tnpm.stp_allowed = "B" OR tnpm.stp_allowed = "O") AND '
					plm_query='tnplm.trxn_type = "SI" AND '
					break;
		case 'switch': 
					pm_query='tnpm.switch_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "AP" AND tnplm.sub_trxn_type = "N" AND '
					break;
	}

	db.getExistingSchemes(req.body,pm_query,plm_query)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getShortlistedSchemes = function(req, res, next) {
	var pm_query = '',plm_query = 'minimum_amount<100000000 AND ';
	switch(req.params.type){
		case 'purchase': 
					pm_query='AND tnpm.purchase_allowed = "Y" '
					plm_query='(T2.trxn_type = "FP" AND T1.purchase_allowed = "Y" ) AND '
					break;
		case 'redemption': 
					pm_query=''
					plm_query = ''
					break;
		case 'sip': 
					pm_query='AND tnpm.sip_allowed = "Y" '
					plm_query='(T2.trxn_type = "SI" AND T1.sip_allowed = "Y" ) AND '
					break;
		case 'swp': 
					pm_query=''
					plm_query = ''
					break;
		case 'stp': 
					pm_query=''
					plm_query = ''
					break;
		case 'switch': 
					pm_query=''
					plm_query = ''
					break;
	}
	
	db.getShortlistedSchemes(req.body,pm_query,plm_query)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.shortlistScheme = function(req, res, next) {
	if(req.body.shortlist){
		db.insertShortlistScheme(req.body)
			.then(function(status){
				if(status.success){
					res.status(201).send({status:'Scheme Shortlisted Successfully.',id:status.id,data:status.data})
				}else{
					res.status(400).send(status.error)
				}
			})
	}else{ // Removed Shortlisted Scheme
		if(req.body.tp_nse_shortlisted_schemes_id){
			db.deleteShortlistScheme(req.body)
				.then(function(status){
					if(status.success){
						if(status.data.affectedRows!=0)
							res.status(200).send('Scheme Removed from Shortlist.')
						else
							res.status(304).send('DB Not Affected.')
					}else{
						res.status(400).send(status.error)
					}
				})
		}else{
			res.status(400).send('Bad Arguments')
		}
	}
}
/* Reflow */
exports.remapFolios = function(req, res, next) {
  var holdings={
    "SI":"SI",
    "SINGLE":"SI",
    "SINGLY":"SI",
    "S":"SI",
    "NOT APPLICABLE":"SI",
    "AS":"AS",
    "Anyone or Survivour":"AS",
    "ANYONE OR SURVIVOR":"AS",
    "E":"ES",
    "ES":"ES",
    "EITHER OR SURVIVOR":"ES",
    "J":"JO",
    "JO":"JO",
    "JOINT":"JO",
    "JOINTLY":"JO"
  }
 //  var credentials=_.find(req.body.brokers,function(o){
	// 	return o.brokerCode!=null
	// })
	var familyMember=req.body.familyMember
	db.getIINByFM(familyMember)
	.then(function(iinList){
		db.getWbr9Folios(familyMember)
		.then(function(wbr9List){
			// set null field to blank in wbr9List for matching with NSE
			_.forEach(wbr9List,function(o){
				o.pan=(_.isNil(o.pan))? "":o.pan
				o.joint_1_pan=(_.isNil(o.joint_1_pan))? "":o.joint_1_pan
				o.joint_2_pan=(_.isNil(o.joint_2_pan))? "":o.joint_2_pan
				o.guardian_pan=(_.isNil(o.guardian_pan))? "":o.guardian_pan				
			})
			var si_iins=_.filter(iinList,function(o){
				return (holdings[o.HOLD_N_CODE]=="SI")
			})
			var other_iins=_.filter(iinList,function(o){
				return (holdings[o.HOLD_N_CODE]!="SI")
			})
			forEach(other_iins,function(row){
	      var done = this.async()
	      fetchIINDetails(req.body.brokers,row.iin)
	      .then(function(iinDetails){
	      	row.details=iinDetails
	      	done()
	      })
			},function(){ // alldone
			  console.log("all details fetched")
				// console.log("si_iins",si_iins)
				// console.log("other_iins",other_iins)
				var si_result=[]
				var other_result=[]
				_.forEach(si_iins,function(single_iin){
					if(single_iin.details){
						var _r=_.filter(wbr9List,function(fl){
							return (
								single_iin.details.HOLD_N_CODE==holdings[fl.mode_of_hold] &&
								single_iin.details.FH_PAN_NO==fl.pan &&
								single_iin.details.JH1_PAN_NO=="" &&
								single_iin.details.JH2_PAN_NO==""
								)
						})
						_.forEach(_r,function(r){r.iin=single_iin.details.CUSTOMER_ID})
						si_result=_.concat(si_result,_r)
					}
				})
				// console.log("result for si_result",si_result)
				_.forEach(other_iins,function(other_iin){
					if(other_iin.details){
						var _r=_.filter(wbr9List,function(fl){
							return (
								other_iin.details.HOLD_N_CODE==holdings[fl.mode_of_hold] &&
								other_iin.details.FH_PAN_NO==fl.pan &&
								other_iin.details.JH1_PAN_NO==fl.joint_1_pan &&
								other_iin.details.JH2_PAN_NO==fl.joint_2_pan
								)
						})
						_.forEach(_r,function(r){r.iin=other_iin.details.CUSTOMER_ID})
						other_result=_.concat(other_result,_r)
					}
				})
				// console.log("other_result for others",other_result)
				var finalResult=_.concat(si_result,other_result)
    		db.remapFolios(finalResult)
				.then(function(result){
					res.status(200).send({
						finalResult:finalResult,
						db:result
					})
				})
			})
			
		})
	})

	function fetchIINDetails(credentials,iin){ // from all credentials
		var deferred = Q.defer();
		var flag=false
		var details={}
		forEach(credentials,function(credential){
			var done=this.async()
			if(flag==true){ // if details fetched already, then skip rest of the calls
				done()
			}else{
				var _postData = Helpers.preparePostRequestData(credential)
				_postData.iin = iin // recieve from req.
				var postData = Helpers.toXmlWrap(dataHandler.jsonToxml(_postData))
				_NSE_Transaction.getIINDetails(postData)
					.then(function(xmlResponse){
						dataHandler.xmlTojson(xmlResponse)
							.then(function(toJson){
								var _data = toJson.NMFIISERVICES
								if(_data.service_status.service_return_code==1){
									console.log("iin:"+iin+" credential:"+JSON.stringify(credential)+" - error: ",_data.service_response.return_msg)
									done()
								}else{
									flag=true
									details=_data.service_response
									done()
								}
							},function(error){
								console.log("error",error)
								done()
							})
					},function(error){
						console.log("error",error)
						done()
					})
			}
		},function(){ // alldone
			console.log("fetchIINDetails completed for :"+iin)
			// console.log("details :",details)
			deferred.resolve(details)
		})
		return deferred.promise;
	}
	/*
	Folio Remap  : Done

		Assume all mapping is in family_iin_mapping
		find iins in family_iin_mapping by FM from req.
			if iin holding is NOT SINGLE 
				then fetch iin details from NSE
				then map with wbr9 data
			else
				map with wbr9 data
	*/
}
exports.mapIINFolio = function(req, res, next) {
	db.mapIINFolio(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getUnmappedFolios = function(req, res, next) {
	db.getUnmappedFolios(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getSchemesByFM = function(req, res, next) {
	var pm_query = '',plm_query = 'minimum_amount<100000000 AND ';
	switch(req.params.type){
		case 'purchase': 
					pm_query='tnpm.purchase_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "AP" AND '
					break;
		case 'redemption': 
					pm_query='tnpm.redemption_allowed = "Y" AND '
					plm_query = '(tnplm.trxn_type = "R" AND tnplm.sub_trxn_type = "N") AND '
					break;
		case 'sip': 
					pm_query='tnpm.sip_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "SI" AND '
					break;
		case 'swp': 
					pm_query='tnpm.swp_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "SI" AND '
					break;
		case 'stp': 
					pm_query='(tnpm.stp_allowed = "Y" OR tnpm.stp_allowed = "B" OR tnpm.stp_allowed = "O") AND '
					plm_query='tnplm.trxn_type = "SI" AND '
					break;
		case 'switch': 
					pm_query='tnpm.switch_allowed = "Y" AND '
					plm_query='tnplm.trxn_type = "AP" AND tnplm.sub_trxn_type = "N" AND '
					break;
	}
	db.getSchemesByFM(req.body,pm_query,plm_query)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getIINByFolio = function(req, res, next) {
	db.getIINByFolio(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getIINByFM = function(req, res, next) {
	db.getIINByFM(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getTransactions = function(req, res, next) {
	db.getTransactions(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.getGoalMapping = function(req, res, next) {
	db.getGoalMapping(req.body)
		.then(function(result){
			res.status(200).send(result)
		})
}
exports.mapGoalTransaction = function(req, res, next) {
	if(req.body.map){
		db.mapGoalTransaction(req.body)
			.then(function(status){
				if(status.success){
					if(status.update)
						res.status(200).send({status:'Goal Transaction Update Successfully.',id:status.id})
					else
						res.status(201).send({status:'Goal Transaction Mapped Successfully.',id:status.id})
				}else{
					res.status(400).send(status.error)
				}
			})
	}else{ // Unmapp Goal Transaction
		db.deleteGoalTransaction(req.body)
			.then(function(status){
				if(status.success){
					if(status.data.affectedRows!=0)
						res.status(200).send('Goal Transaction Un-Mapped Successfully.')
					else
						res.status(304).send('DB Not Affected.')
				}else{
					res.status(400).send(status.error)
				}
			})
	}
}
/* Credentials */
exports.getCredentials = function(req, res, next) {
	db.getCredentialsForAll(req.body)
		.then(function(result){
			var _result={
				brokers:[],
				subbrokers:[]
			}
			_.forEach(result.brokers,function(o){
				_result.brokers.push({
					"tp_nse_credentials_id":o.tp_nse_credentials_id,
					"advisorId":o.advisor_id,
					"brokerCode":o.broker_code,
					"applicationId":o.application_id,
					"password":o.password,
					"riaCode":o.ria_code,
					"riaApplicationId":o.ria_application_id,
					"riaPassword":o.ria_password,
					"defaultLogin":o.default_login,
				})
			})
			_.forEach(result.subbrokers,function(o){
				_result.subbrokers.push({
					"tp_nse_subbroker_mapping_id":o.tp_nse_subbroker_mapping_id,
					"advisorId":o.advisor_id,
					"teamMemberSessionId":o.team_member_session_id,
					"tp_nse_credentials_id":o.tp_nse_credentials_id,
					"euin":o.euin,
					"subBrokerCode":o.sub_broker_code
				})
			})
			res.status(200).send(_result)
		},function(error){
			res.status(400).send(error)
		})
}
exports.getBrokersCredentials = function(req, res, next) {
	db.getBrokersCredentials(req.body)
		.then(function(result){
			var _result=[]
			_.forEach(result,function(o){
				_result.push({
					"tp_nse_credentials_id":o.tp_nse_credentials_id,
					"advisorId":o.advisor_id,
					"brokerCode":o.broker_code,
					"applicationId":o.application_id,
					"password":o.password,
					"riaCode":o.ria_code,
					"riaApplicationId":o.ria_application_id,
					"riaPassword":o.ria_password,
					"defaultLogin":o.default_login,
				})
			})
			res.status(200).send(_result)
		},function(error){
			res.status(400).send(error)
		})
}
exports.updateBrokersCredentials = function(req, res, next) {
	db.updateBrokersCredentials(req.body)
		.then(function(result){
			res.status(200).send(result)
		},function(error){
			res.status(400).send(error)
		})
}
exports.removeBrokersCredentials = function(req, res, next) {
	db.removeBrokersCredentials(req.body)
		.then(function(result){
			res.status(200).send(result)
		},function(error){
			res.status(400).send(error)
		})
}
exports.getSubBrokersCredentials = function(req, res, next) {
	db.getSubBrokersCredentials(req.body)
		.then(function(result){
			var _result=[]
			_.forEach(result,function(o){
				_result.push({
					"tp_nse_subbroker_mapping_id":o.tp_nse_subbroker_mapping_id,
					"advisorId":o.advisor_id,
					"teamMemberId":o.team_member_id,
					"teamMemberSessionId":o.team_member_session_id,
					"tp_nse_credentials_id":o.tp_nse_credentials_id,
					"euin":o.euin,
					"subBrokerCode":o.sub_broker_code
				})
			})
			res.status(200).send(_result)
		},function(error){
			res.status(400).send(error)
		})
}
exports.updateSubBrokersCredentials = function(req, res, next) {
	db.updateSubBrokersCredentials(req.body)
		.then(function(result){
			res.status(200).send(result)
		},function(error){
			res.status(400).send(error)
		})
}
exports.removeSubBrokersCredentials = function(req, res, next) {
	db.removeSubBrokersCredentials(req.body)
		.then(function(result){
			res.status(200).send(result)
		},function(error){
			res.status(400).send(error)
		})
}