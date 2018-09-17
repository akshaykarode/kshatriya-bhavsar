var Helpers = require('./helpers')
var Authentication = require('./../controllers/loginController.js')
var masterListController = require('./../controllers/masterListController.js')
var transactionController = require('./../controllers/transactionController.js')
var dbController = require('./../controllers/dbController.js')
var dbConsoleController = require('./../controllers/dbConsoleController.js')

module.exports = function(app){
	
	app.get("/", Authentication.welcome);
	
	/* ------------------ Authentication ------------------ */
	app.post("/login", Authentication.login);
	app.post("/autologin", Authentication.autoLogin);
	app.post("/verify-credentials", Authentication.verifyCredentials);
	app.get("/status", Helpers.checkAuth, Authentication.status);
	app.get("/logout", Authentication.logout);

	/* ------------------ MasterList ------------------ */
	app.get("/account-type", Helpers.checkAuth, masterListController.getAccountTypeMaster);
	app.get("/holding-nature", Helpers.checkAuth, masterListController.getHoldingNatureMaster);
	app.get("/occupation", Helpers.checkAuth, masterListController.getOccupationMaster);
	app.get("/country", Helpers.checkAuth, masterListController.getCountryMaster);
	app.get("/bank", Helpers.checkAuth, masterListController.getBankMaster);
	app.get("/state", Helpers.checkAuth, masterListController.getStateMaster);
	app.post("/city", Helpers.checkAuth, masterListController.getCityMaster);
	app.get("/tax", Helpers.checkAuth, masterListController.getTaxMaster);
	app.get("/location", Helpers.checkAuth, masterListController.getLocationMaster);
	app.get("/amc", Helpers.checkAuth, masterListController.getAmcMaster);
	app.post("/product", Helpers.checkAuth, masterListController.getProductMaster);
	app.get("/transaction-type", Helpers.checkAuth, masterListController.getTransactionTypeMaster);
	app.get("/payment-mechanism", Helpers.checkAuth, masterListController.getPaymentMechanismMaster);
	app.post("/product-limit", Helpers.checkAuth, masterListController.getProductLimitMaster);
	app.get("/pan-exempt-category", Helpers.checkAuth, masterListController.getPANExemptCategoryMaster);
	app.get("/billdesk-bank", Helpers.checkAuth, masterListController.getBillDeskBankMaster);
	app.get("/applicable-income", Helpers.checkAuth, masterListController.getApplicableIncomeMaster);
	app.get("/source-wealth", Helpers.checkAuth, masterListController.getSourceWealthMaster);
	app.get("/id-type", Helpers.checkAuth, masterListController.getIDTypeMaster);
	app.get("/active-nfe", Helpers.checkAuth, masterListController.getActiveNFEMaster);
	app.get("/exemption", Helpers.checkAuth, masterListController.getExemptionMaster);
	app.get("/giin-exemption", Helpers.checkAuth, masterListController.getGIINExemptionMaster);
	app.get("/ubo", Helpers.checkAuth, masterListController.getUBOMaster);
	app.post("/pincode", Helpers.checkAuth, masterListController.getPincodeMaster);

	/* ------------------ Transaction ------------------ */
	// app.post("/get-iins", transactionController.getIINs);
	app.post("/get-all-iins", Helpers.checkAuth, transactionController.getAllIINs);
	app.post("/get-filtered-iins", transactionController.getFilteredIINs);
	app.post("/get-iin-details", Helpers.checkAuth, transactionController.getIINDetails);
	app.post("/get-iin-status", Helpers.checkAuth, transactionController.getIINModificationStatus);
	app.post("/get-iin-bank-details", Helpers.checkAuth, transactionController.getIINBankDetails);
	app.post("/get-transaction-feed", Helpers.checkAuth, transactionController.getTransactionReverseFeed);
	app.post("/get-achmandate-report", Helpers.checkAuth, transactionController.getACHMandateReport);
	app.post("/get-addl-bank-mandate-report", Helpers.checkAuth, transactionController.getADDLBankMandateReport);
	app.post("/get-iin-transactions", Helpers.checkAuth, transactionController.getIINTransactions);

	app.post("/transaction/purchase", Helpers.checkAuth, transactionController.purchaseTransaction);
	app.post("/transaction/redemption", Helpers.checkAuth, transactionController.redemptionTransaction);
	app.post("/transaction/switch", Helpers.checkAuth, transactionController.switchTransaction);
	app.post("/transaction/systematic", Helpers.checkAuth, transactionController.systematicTransaction);

	/* ------------------ DB Ops------------------ */
	app.post("/map-iin", dbController.mapIIN);
	app.get("/get-all-banks", dbController.getAllBanks);
	app.get("/get-all-amcs", dbController.getAllAmcs);
	app.post("/get-empanelled-amcs", dbController.getEmpanelledAmcs);
	app.post("/empanel-amc", dbController.empanelAmc);
	app.post("/search/schemes", dbController.searchSchemes);
	app.post("/search/schemes/catagorized", dbController.searchCategorizedSchemes);
	app.post("/search/schemes/:type", dbController.searchSchemes);
	app.post("/get-existing-schemes", dbController.getExistingSchemes);
	app.post("/get-existing-schemes/:type", dbController.getExistingSchemes);
	app.post("/get-shortlisted-schemes", dbController.getShortlistedSchemes);
	app.post("/get-shortlisted-schemes/:type", dbController.getShortlistedSchemes);
	// app.post("/get-all-schemes", dbController.getAllSchemes);
	app.post("/shortlist-scheme", dbController.shortlistScheme);
	app.post("/get-transactions", dbController.getTransactions);
	app.post("/get-goalmapping", dbController.getGoalMapping);
	app.post("/map-goal-transaction", dbController.mapGoalTransaction);

	app.post("/credentials/get-credentials", dbController.getCredentials);
	app.post("/credentials/get-broker-credentials", dbController.getBrokersCredentials);
	app.post("/credentials/update-broker-credentials", dbController.updateBrokersCredentials);
	app.post("/credentials/remove-broker-credentials", dbController.removeBrokersCredentials);
	app.post("/credentials/get-subbroker-credentials", dbController.getSubBrokersCredentials);
	app.post("/credentials/update-subbroker-credentials", dbController.updateSubBrokersCredentials);
	app.post("/credentials/remove-subbroker-credentials", dbController.removeSubBrokersCredentials);

	/* ------------------ REFLOW ------------------ */
	app.post("/remap-folios", dbController.remapFolios);
	app.post("/map-iin-folio", dbController.mapIINFolio);
	app.post("/get-unmapped-folios", dbController.getUnmappedFolios);
	app.post("/get-schemes-byfm/:type", dbController.getSchemesByFM);
	app.post("/get-iin-byfolio", dbController.getIINByFolio);
	app.post("/get-iin-byfm", dbController.getIINByFM);

	/* ------------------ CRON JOBS ------------------ */
	app.post("/update/amc-master", dbConsoleController.resetAmcMaster);
	app.post("/update/bank-master", dbConsoleController.resetBankMaster);
	app.post("/update/scheme-master", dbConsoleController.resetSchemeMaster);
	app.post("/update/scheme-limit-master", dbConsoleController.resetSchemeLimitMaster);
	app.post("/update/family-iin-mapping", dbConsoleController.updateFamilyIInMapping);

}

/*

var Sample = require('./sample-module/sm.js')
var Authentication = require('./auth/authentication.js')

module.exports = function(app){
	app.get("/", function (req, res) {
	  res.render('index', { template locals context  });
	});
	
	Sample.includeRoutes(app)
	Authentication.includeRoutes(app)
}

*/