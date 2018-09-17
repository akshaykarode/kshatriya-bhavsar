var nseApi = require('./../modules/nse-api')
var Helpers = require('./../modules/helpers')
var dataHandler = nseApi.JSONXMLHandler;

var xmlResponse='<NMFIISERVICES><service_response diffgr:id="service_response1" msdata:rowOrder="0" diffgr:hasChanges="inserted"><Status_Desc>No Data Found</Status_Desc></service_response><service_status diffgr:id="service_status1" msdata:rowOrder="0" diffgr:hasChanges="inserted"><service_return_code>1</service_return_code><service_msg>Failure</service_msg></service_status></NMFIISERVICES>'
console.log(typeof xmlResponse)
dataHandler.xmlTojson(xmlResponse)
.then(function(toJson){
	console.log("toJson",toJson)
	var _data = toJson.NMFIISERVICES
	var _toJson = {
		"status":Helpers.verifyResponse(_data),
		"data":_data.service_response
	}
	console.log("_toJson",_toJson)
},function(error){
	console.log("error",error)
})