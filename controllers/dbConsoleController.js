var Q = require('q'),
		_ = require('lodash'),
		Helpers = require('./../modules/helpers')

exports.resetAmcMaster = function(req, res, next) {
	console.log("resetAmcMaster")
	db_console.resetAmcMaster({})
		.then(function(result){
			if(result.success){
				res.status(200).send('Updated Successfully.')
			}else{
				res.status(400).send(result.error)
			}
		})
}
exports.resetBankMaster = function(req, res, next) {
	console.log("resetBankMaster")
	db_console.resetBankMaster({})
		.then(function(result){
			if(result.success){
				res.status(200).send('Updated Successfully.')
			}else{
				res.status(400).send(result.error)
			}
		})
}
exports.resetSchemeMaster = function(req, res, next) {
	console.log("resetSchemeMaster")
	db_console.resetSchemeMaster({})
		.then(function(result){
			if(result.success){
				res.status(200).send('Updated Successfully.')
			}else{
				res.status(400).send(result.error)
			}
		})
}
exports.resetSchemeLimitMaster = function(req, res, next) {
	console.log("resetSchemeLimitMaster")
	db_console.resetSchemeLimitMaster({})
		.then(function(result){
			if(result.success){
				res.status(200).send('Updated Successfully.')
			}else{
				res.status(400).send(result.error)
			}
		})
}
exports.updateFamilyIInMapping = function(req, res, next) {
	console.log("updateFamilyIInMapping")
	db_console.updateFamilyIInMapping({})
		.then(function(result){
			if(result.success){
				res.status(200).send('Updated Successfully.')
			}else{
				res.status(400).send(result.error)
			}
		})
	/*
	FM IIN Map : 

		Daily Cron Job
		DUMP all iins for Single PAN
		Update if similar found

		---
		0.get all credentials with team_member_session_id
			SELECT c.team_member_session_id,fim.broker_code,fim.application_id,fim.password FROM `tp_nse_family_iin_mapping` fim
			INNER JOIN clients c
			ON
			c.client_id=fim.client_id
			GROUP BY c.team_member_session_id

			SELECT c.team_member_session_id,tnc.broker_code,tnc.application_id,tnc.password FROM `tp_nse_credentials` tnc
			INNER JOIN clients c
			ON
			c.advisor_id=tnc.advisor_id
		    WHERE tnc.broker_code IS NOT NULL 
			GROUP BY c.team_member_session_id


		1.fetch all iins from single credentials
		2.get all clients of single advisor from DB
		3.do mapping = util.mapIINtoFamilyMember(fromNse_iins,fromDb_clients) 
		4.refer function code exports.getIINs

	*/
}
