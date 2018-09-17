var js2xmlparser = require("js2xmlparser"),
		xml2js = require('xml2js'),
		parseString = xml2js.parseString,
		Q = require('q');

var js2xmlparserOptions={"declaration":{"include":false}},
		parseStringOptions={
			"explicitArray":false,
			"ignoreAttrs":true
			// ,"valueProcessors": [ xml2js.processors.parseNumbers ]
		}

module.exports = {
	jsonToxml : jsonToxml,
	jsonToxmlForTransactions:jsonToxmlForTransactions,
	xmlTojson : xmlTojson
}

/* ------------------- fn ------------------- */
function jsonToxml(jsondata){
	var xmldata = js2xmlparser("service_request",jsondata,js2xmlparserOptions)
	return xmldata;
}
function jsonToxmlForTransactions(jsondata){
	var xmldata = '';
	for(var i=0;i<jsondata.length;i++){
		xmldata+=js2xmlparser("childtrans",jsondata[i],js2xmlparserOptions)
	}
	return xmldata;
}
function xmlTojson(xmldata){
	var deferred = Q.defer();
	parseString(xmldata,parseStringOptions,function(err,result){
		if(!err)
			deferred.resolve(result)
		else
			deferred.reject(new Error("xmlTojson failed."))
	});
	return deferred.promise;
}
/* ------------------- fn end ------------------- */