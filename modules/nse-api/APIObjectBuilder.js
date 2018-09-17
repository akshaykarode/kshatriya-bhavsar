
function APIObjectBuilder(nse_env){
	nseConfig = require('./../../configs/nse-config.json')[nse_env]
  return this
}

/*
All changes are according to following version of NSE NMFII API Docs

[x] NMFIIExpTrxnService : v 2.3 (16 March 2018)
[x] NMFTrxnService : v 6.3 (16 March 2018)

*/

APIObjectBuilder.prototype.purchaseObject = function(reqBody){
	var obj={
		url:'',
		postData:{},
		transactions:[]
	}
	if(reqBody.extras.isException){
		/* NMFIIExpTrxnService */
		obj.url=nseConfig.transactionExceptionUrl+"/PURCHASETRXNEXCEPTION"
		obj.postData=this.purchaseObjectComman(reqBody,obj.postData)
		obj.transactions=this.purchaseTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
	}else{
		/* NMFTrxnService */
		obj.url=nseConfig.transactionUrl+"/PURCHASETRXN"
		obj.postData=this.purchaseObjectComman(reqBody,obj.postData)
		obj.transactions=this.purchaseTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
	}
	
	return obj;
}
APIObjectBuilder.prototype.redemptionObject = function(reqBody){
	var obj={
		url:'',
		postData:{},
		transactions:[]
	}
	if(reqBody.extras.isException){
		/* NMFIIExpTrxnService */
		obj.url=nseConfig.transactionExceptionUrl+"/REDEEMTRXNEXCEPTION"
		obj.postData=this.redemptionObjectComman(reqBody,obj.postData)
		obj.transactions=this.redemptionTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
		obj.transactions.reinvest = reqBody.transactions.reinvest || ''

	}else{
		/* NMFTrxnService */
		obj.url=nseConfig.transactionUrl+"/REDEEMTRXN"
		obj.postData=this.redemptionObjectComman(reqBody,obj.postData)
		obj.transactions=this.redemptionTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
	}
	
	return obj;
}
APIObjectBuilder.prototype.switchObject = function(reqBody){
	var obj={
		url:'',
		postData:{},
		transactions:[]
	}
	if(reqBody.extras.isException){
		/* NMFIIExpTrxnService */
		obj.url=nseConfig.transactionExceptionUrl+"/SWITCHTRXNEXCEPTION"
		obj.postData=this.switchObjectComman(reqBody,obj.postData)
		obj.transactions=this.switchTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
		obj.transactions.source_reinvest = reqBody.transactions.source_reinvest // NOT MANDATORY
		obj.transactions.target_reinvest = reqBody.transactions.target_reinvest // NOT MANDATORY

	}else{
		/* NMFTrxnService */
		obj.url=nseConfig.transactionUrl+"/SWITCHTRXN"
		obj.postData=this.switchObjectComman(reqBody,obj.postData)
		obj.transactions=this.switchTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
		obj.postData.trxn_execution = reqBody.data.trxn_execution // NOT MANDATORY
		obj.transactions.reinvest = reqBody.transactions.reinvest || ''
	}
	return obj;
}
APIObjectBuilder.prototype.systematicObject = function(reqBody){
	var obj={
		url:'',
		postData:{},
		transactions:[]
	}
	if(reqBody.extras.isException){
		/* NMFIIExpTrxnService */
		obj.url=nseConfig.transactionExceptionUrl+"/SYSTRXNREGEXCEPTION"
		obj.postData=this.systematicObjectComman(reqBody,obj.postData)
		obj.transactions=this.systematicTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
		obj.transactions.source_reinvest = reqBody.transactions.source_reinvest // NOT MANDATORY
		obj.transactions.target_reinvest = reqBody.transactions.target_reinvest // NOT MANDATORY

	}else{
		/* NMFTrxnService */
		obj.url=nseConfig.transactionUrl+"/SYSTRXNREG"
		obj.postData=this.systematicObjectComman(reqBody,obj.postData)
		obj.transactions=this.systematicTransactionsObjectComman(reqBody,obj.transactions)
		/* Un Comman */
		obj.postData.trxn_initiator = reqBody.data.trxn_initiator // NOT MANDATORY
		obj.transactions.reinvest = reqBody.transactions.reinvest || ''
	}
	return obj;
}
/* Comman */
APIObjectBuilder.prototype.purchaseObjectComman = function(reqBody,_postData){
	//1.payment mode - OTM & DM - UMRN required - get from getACHMandateReport
 	//2.payment mode - Online - UMRN not required

 	/* If UMRN Exist then Bank Name, Branch Name, Account Number, Account Type, Debit
		Amount Type, ACH Amount, ACH From Date, ACH End Date will be passed automatically 
		to the database based on UMRN. so no need to provide the value again in the
		Bank Name, Branch Name Tags etc..you can leave blank if UMRN provided. */

 	// if(reqBody.data.payment_mode=='DM' || reqBody.data.payment_mode=='OTM'){
 		
 	// }else if(reqBody.data.payment_mode=='OL'){
 	// 	_postData.payment_mode = reqBody.data.payment_mode // recieve from req. | OL for online
 	// 	_postData.umrn = ''
 	// }
 	
 	_postData.iin = reqBody.data.iin // recieve from req.
 	_postData.sub_trxn_type = reqBody.data.sub_trxn_type // 'N' for normal, 'S' for systematic.
 	_postData.poa = 'N' // Executed by POA – values Y or N
 	_postData.trxn_acceptance = reqBody.data.trxn_acceptance // Ph(By Phone) or OL(Online) or ALL
 	_postData.demat_user = reqBody.data.demat_user // Y or N
 	_postData.dp_id = reqBody.data.dp_id
 	_postData.bank = reqBody.data.bank // recieve from req. | client need to validate from getIINDetails-BANK_NAME.
 	_postData.ac_no = reqBody.data.ac_no // recieve from req.
 	_postData.ifsc_code = reqBody.data.ifsc_code // recieve from req.
 	_postData.sub_broker_arn_code = reqBody.data.sub_broker_arn_code // NOT MANDATORY
 	_postData.sub_broker_code = reqBody.data.sub_broker_code // NOT MANDATORY
 	_postData.euin_opted = (reqBody.data.euin_opted!='')? reqBody.data.euin_opted : 'N'; // Y or N | if recieve from req. Y else N 
 	_postData.euin = (reqBody.data.euin!='')? reqBody.data.euin : ''; // if recieve from req.
 	_postData.trxn_execution = reqBody.data.trxn_execution // NOT MANDATORY
 	_postData.remarks = reqBody.data.remarks // NOT MANDATORY
 	_postData.payment_mode = reqBody.data.payment_mode // recieve from req. | OL for online
 	_postData.billdesk_bank = reqBody.data.billdesk_bank // recieve from req. | client need to validate from getIINDetails-BANK_NAME.
 	
 	_postData.instrm_bank = reqBody.data.instrm_bank // Based on payment mode
 	_postData.instrm_ac_no = '' // Based on payment mode 
 	_postData.instrm_no = '' // Based on payment mode 
 	_postData.instrm_amount = reqBody.data.instrm_amount // recieve from req.
 	_postData.instrm_date = '' // Based on payment mode | Date(dd-Mon-yyyy)
 	_postData.instrm_branch = '' // Based on payment mode 
 	_postData.instrm_charges = '' // Based on payment mode 
 	
 	_postData.micr = '' // Based on payment mode
 	_postData.rtgs_code = '' // Based on payment mode
 	_postData.neft_ifsc = '' // Based on payment mode
 	_postData.advisory_charge = '' // NOT MANDATORY
 	_postData.dd_charge = '' // Based on payment mode
 	_postData.cheque_deposit_mode = '' // NOT MANDATORY
 	_postData.debit_amount_type = reqBody.data.debit_amount_type // Mandatory if Sub_trxn_type is Systematic
 	
 	_postData.sip_paymech = reqBody.data.sip_paymech // Mandatory if Sub_trxn_type is Systematic
 	_postData.sip_micr_no = reqBody.data.sip_micr_no // NOT MANDATORY
 	_postData.sip_bank = reqBody.data.sip_bank // Mandatory if Sub_trxn_type is Systematic
 	_postData.sip_branch = reqBody.data.sip_branch // Mandatory if Sub_trxn_type is Systematic
 	_postData.sip_acc_no = reqBody.data.sip_acc_no // Mandatory if Sub_trxn_type is Systematic
 	_postData.sip_ac_type = reqBody.data.sip_ac_type // Mandatory if Sub_trxn_type is Systematic
 	_postData.sip_ifsc_code = reqBody.data.sip_ifsc_code // NOT MANDATORY

 	_postData.umrn = reqBody.data.umrn
	_postData.ach_amt = reqBody.data.ach_amt // Mandatory if Sub_trxn_type is Systematic
 	_postData.ach_fromdate = reqBody.data.ach_fromdate // Mandatory if Sub_trxn_type is Systematic. 
 	_postData.ach_enddate = reqBody.data.ach_enddate // Mandatory if Sub_trxn_type is Systematic. 

 	/*if until_cancelled =”Y” default date will be “31-Dec-2999” */
 	_postData.until_cancelled = reqBody.data.until_cancelled // recieve from req. | Mandatory if Sub_trxn_type is Systematic
 	/* Y or N. If Return Payment Flag is 'Y' then you should provide the 
 	Client Call Back URL. Ref section 1.5 (New API Online Payment Process) 
 	If Return Payment Flag is 'N' then will work as normal. */
 	_postData.Return_paymnt_flag = 'Y'
 	/* Provide your Webpage / API URL. After Payment, page will be redirect to 
 	client call back url with Customer ID and Payment Ref No in the URL: Example Url given below
	http://YourURL?CustomerID=5011000029&PaymentRefNo=541 */
 	_postData.Client_callback_url = config.url+'/transaction-status.html'

 	_postData.Bank_holder_name = reqBody.data.Bank_holder_name // Based on payment mode
 	_postData.Bank_holder_name1= reqBody.data.Bank_holder_name1 // NOT MANDATORY
	_postData.Bank_holder_name2= reqBody.data.Bank_holder_name2 // NOT MANDATORY
	_postData.iin_conf_flag = 'N' // NOT MANDATORY
 	_postData.trxn_initiator = reqBody.data.trxn_initiator // NOT MANDATORY
 	_postData.trans_count=reqBody.transactions.length
	_postData.utr_no = (reqBody.data.utr_no!='')? reqBody.data.utr_no : ''; // NOT MANDATORY - use for transaction ref.
	_postData.transfer_date = (reqBody.data.transfer_date)? reqBody.data.transfer_date : ''; // NOT MANDATORY
	_postData.insurance_enabled = (reqBody.data.insurance_enabled)? reqBody.data.insurance_enabled : 'N'; // NOT MANDATORY - only for Systematic (Y/N)
	_postData.investor_auth_log = (reqBody.data.investor_auth_log)? reqBody.data.investor_auth_log : ''; // NOT MANDATORY
	_postData.ach_exist = (reqBody.data.ach_exist!='')? reqBody.data.ach_exist : 'N' // NOT MANDATORY

	return _postData
}
APIObjectBuilder.prototype.purchaseTransactionsObjectComman = function(reqBody,_transactions){
	
	for(var i=0;i<reqBody.transactions.length;i++){
		_transactions.push({
			'amc':reqBody.transactions[i].amc || '',
			'folio':reqBody.transactions[i].folio || '',
			'product_code':reqBody.transactions[i].product_code || '',
			'ft_acc_no':reqBody.transactions[i].ft_acc_no || '',
			'reinvest':reqBody.transactions[i].reinvest || '',
			'amount':reqBody.transactions[i].amount || '',
			'sip_from_date':reqBody.transactions[i].sip_from_date || '',
			'sip_end_date':reqBody.transactions[i].sip_end_date || '',
			'sip_freq':reqBody.transactions[i].sip_freq || '',
			'sip_amount':reqBody.transactions[i].sip_amount || '',
			'sip_period_day':reqBody.transactions[i].sip_period_day || '',
			'input_ref_no':reqBody.transactions[i].input_ref_no || '',
			'perpetual_flag':reqBody.transactions[i].perpetual_flag || '',
		})
	}

	return _transactions
}
APIObjectBuilder.prototype.redemptionObjectComman = function(reqBody,_postData){

	_postData.iin = reqBody.data.iin // recieve from req.
 	_postData.poa = 'N' // Executed by POA – values Y or N
 	_postData.trxn_acceptance = 'OL' // Ph(By Phone) or OL(Online) or ALL
 	_postData.dp_id = reqBody.data.dp_id
 	_postData.acc_no = reqBody.data.ac_no // recieve from req.
 	_postData.bank_name = reqBody.data.bank // recieve from req. | client need to validate from getIINDetails-BANK_NAME.
 	_postData.ifsc_code = reqBody.data.ifsc_code // recieve from req.
 	_postData.remarks = reqBody.data.remarks // NOT MANDATORY
	_postData.iin_conf_flag = 'N' // NOT MANDATORY
 	_postData.trxn_initiator = reqBody.data.trxn_initiator || 'O' // NOT MANDATORY
 	_postData.trans_count = reqBody.transactions.length	
	_postData.investor_auth_log = (reqBody.data.investor_auth_log)? reqBody.data.investor_auth_log : ''; // MANDATORY

	return _postData
}
APIObjectBuilder.prototype.redemptionTransactionsObjectComman = function(reqBody,_transactions){
	
	for(var i=0;i<reqBody.transactions.length;i++){
		_transactions.push({
			'amc':reqBody.transactions[i].amc || '',
			'folio':reqBody.transactions[i].folio || '',
			'product_code':reqBody.transactions[i].product_code || '',
			'ft_acc_no':reqBody.transactions[i].ft_acc_no || '', // FT Scheme Account Number
			'amt_unit_type':reqBody.transactions[i].amt_unit_type || '',
			'amt_unit':reqBody.transactions[i].amt_unit || '',
			'all_units':reqBody.transactions[i].all_units || '',
			'input_ref_no':reqBody.transactions[i].input_ref_no || '',
		})
	}

	return _transactions
}
APIObjectBuilder.prototype.switchObjectComman = function(reqBody,_postData){

	_postData.iin = reqBody.data.iin // recieve from req.
 	_postData.poa = 'N' // Executed by POA – values Y or N
 	_postData.trxn_acceptance = 'OL' // Ph(By Phone) or OL(Online) or ALL
 	_postData.dp_id = (reqBody.data.dp_id!='')? reqBody.data.dp_id : 'N'; // if recieve from req. Y else N 
 	_postData.sub_broker_arn_code=reqBody.data.sub_broker_arn_code
 	_postData.sub_broker_code=reqBody.data.sub_broker_code
 	_postData.euin_opted=reqBody.data.euin_opted;
	_postData.euin=reqBody.data.euin
 	_postData.remarks = reqBody.data.remarks // NOT MANDATORY
	_postData.iin_conf_flag = 'N' // NOT MANDATORY
 	_postData.trxn_initiator = reqBody.data.trxn_initiator // NOT MANDATORY
 	_postData.trans_count = reqBody.transactions.length	
	_postData.investor_auth_log = (reqBody.data.investor_auth_log)? reqBody.data.investor_auth_log : ''; // NOT MANDATORY

	return _postData
}
APIObjectBuilder.prototype.switchTransactionsObjectComman = function(reqBody,_transactions){
	
	for(var i=0;i<reqBody.transactions.length;i++){
		_transactions.push({
			'amc':reqBody.transactions[i].amc || '',
			'folio':reqBody.transactions[i].folio || '',
			'source_product_code':reqBody.transactions[i].source_product_code || '',
			'target_product_code':reqBody.transactions[i].target_product_code || '',
			'source_ft_acc_no':reqBody.transactions[i].source_ft_acc_no || '', // FT Scheme Account Number
			'target_ft_acc_no':reqBody.transactions[i].target_ft_acc_no || '', // FT Scheme Account Number
			'reinvest':reqBody.transactions[i].reinvest || '',
			'amt_unit_type':reqBody.transactions[i].amt_unit_type || '',
			'amt_unit':reqBody.transactions[i].amt_unit || '',
			'all_units':reqBody.transactions[i].all_units || '',
			'input_ref_no':reqBody.transactions[i].input_ref_no || '',
		})
	}

	return _transactions
}
APIObjectBuilder.prototype.systematicObjectComman = function(reqBody,_postData){
	
	_postData.iin = reqBody.data.iin // recieve from req.
 	_postData.trxn_type = reqBody.data.trxn_type // Executed by POA – values Y or N
 	_postData.dp_id = reqBody.data.dp_id; // if recieve from req. Y else N 
 	_postData.euin_opted=(reqBody.data.euin_opted!='')? reqBody.data.euin_opted : 'N';
	_postData.euin = reqBody.data.euin
 	_postData.sub_brok_arn = reqBody.data.sub_brok_arn
 	_postData.trxn_acceptance = reqBody.data.trxn_acceptance 
 	_postData.sip_pay_mech = reqBody.data.sip_pay_mech // Applicable only for SIP
	_postData.acc_no = reqBody.data.acc_no // Applicable only for SIP
	_postData.bank = reqBody.data.bank // Applicable only for SIP
	_postData.branch = reqBody.data.branch // Applicable only for SIP
	_postData.acc_type = reqBody.data.acc_type // Applicable only for SIP
	_postData.micr_no = reqBody.data.micr_no // Applicable only for SIP
	_postData.ifsc_code = reqBody.data.ifsc_code // Applicable only for SIP
	_postData.debit_amt_type = reqBody.data.debit_amt_type // Applicable only for SIP
	_postData.umrn = reqBody.data.umrn
	_postData.ach_amt = reqBody.data.ach_amt
	_postData.ach_fromdate = reqBody.data.ach_fromdate
	_postData.ach_enddate = reqBody.data.ach_enddate
	_postData.until_cancelled = reqBody.data.until_cancelled
 	
 	_postData.Bank_holder_name = reqBody.data.Bank_holder_name // MANDATORY
 	_postData.Bank_holder_name1= reqBody.data.Bank_holder_name1 // NOT MANDATORY
	_postData.Bank_holder_name2= reqBody.data.Bank_holder_name2 // NOT MANDATORY
	
 	_postData.trans_count = reqBody.transactions.length	
	_postData.insurance_enabled = (reqBody.data.insurance_enabled)? reqBody.data.insurance_enabled : 'N'; // NOT MANDATORY - only for Systematic (Y/N)
	_postData.ach_exist = (reqBody.data.ach_exist!='')? reqBody.data.ach_exist : 'N' // NOT MANDATORY

	return _postData
}
APIObjectBuilder.prototype.systematicTransactionsObjectComman = function(reqBody,_transactions){
	
	for(var i=0;i<reqBody.transactions.length;i++){
		_transactions.push({
			'amc':reqBody.transactions[i].amc || '',
			'folio':reqBody.transactions[i].folio || '',
			'product_code':reqBody.transactions[i].product_code || '',
			'target_product':reqBody.transactions[i].target_product || '',
			'source_ft_acc_no':reqBody.transactions[i].source_ft_acc_no || '',
			'target_ft_acc_no':reqBody.transactions[i].target_ft_acc_no || '',
			'from_date':reqBody.transactions[i].from_date || '',
			'to_date':reqBody.transactions[i].to_date || '',
			'reinvest':reqBody.transactions[i].reinvest || '',
			'periodicity':reqBody.transactions[i].periodicity || '',
			'period_day':reqBody.transactions[i].period_day || '',
			'input_ref_no':reqBody.transactions[i].input_ref_no || '',
			'perpetual_flag':reqBody.transactions[i].perpetual_flag || '',
			'amt_unit_type':reqBody.transactions[i].amt_unit_type || '',
			'amt_unit':reqBody.transactions[i].amt_unit || '',
			'all_units':reqBody.transactions[i].all_units || '',
			'input_ref_no':reqBody.transactions[i].input_ref_no || '',
			'perpetual_flag':reqBody.transactions[i].perpetual_flag || '',
		})
	}

	return _transactions
}
module.exports = APIObjectBuilder;