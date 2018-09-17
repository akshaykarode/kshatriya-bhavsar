/* List of dependancies here 
*/
var Helpers = require('../helpers');
var js2xmlparser = require("js2xmlparser");
var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;
var js2xmlparserOptions={}
var parseStringOptions={
	"explicitArray":false,
	"valueProcessors": [ xml2js.processors.parseNumbers ]
}

var xml = '<NMFIISERVICES><service_response diffgr:id="service_response1" msdata:rowOrder="0"><Unique_No>213659</Unique_No><Trxn_No>175802</Trxn_No><Fund>DSP BlackRock Investment Managers Private Limited</Fund><Folio/><Scheme>15</Scheme><Scheme_Name>DSP BlackRock Top 100 Equity Fund - Regular Plan - Growth</Scheme_Name><Amt>10,000.00</Amt><Status_Desc>Ok</Status_Desc><Paymentlink>&lt;a href="https://www.nsenmf.com/Transactions/MFDMakePayment.aspx?O1JKVENdMornzFdBDr%2bLZE2YcOSA9HoWgyBh7LJqmZmjb2kOb42X10KU%2fCLoBGMG%2b90e3wY0qWP9bZfzefx3Rnf8Q3aQF0kVQCFhXmtV1gM7mAh3sy58YFJx3Ejva6DawYWtxc%2fObBEDscXGWqxUOdZMzJgsmO51CMLwHz6XvOq8e0xqbvayAvc5xgQv7P%2bMGti2EFkxvMS%2bbjaalEVhSFtGqWv0KJ%2fH3PXFWgeTyj988Vf4sSb6ZPkcISQlGWLLddneiEIXMbyponDwJjLJhFTML4Fm84oKQ%2fiAeHTRXCXWbRJLEa7H6blKJnFM%2fDOLIZJk%2b%2fZ9z74SeQtiHBp7aXO5VLQxlJvgi%2bn%2bQTbjQcM%3d"&gt;https://www.nsenmf.com/Transactions/MFDMakePayment.aspx?O1JKVENdMornzFdBDr%2bLZE2YcOSA9HoWgyBh7LJqmZmjb2kOb42X10KU%2fCLoBGMG%2b90e3wY0qWP9bZfzefx3Rnf8Q3aQF0kVQCFhXmtV1gM7mAh3sy58YFJx3Ejva6DawYWtxc%2fObBEDscXGWqxUOdZMzJgsmO51CMLwHz6XvOq8e0xqbvayAvc5xgQv7P%2bMGti2EFkxvMS%2bbjaalEVhSFtGqWv0KJ%2fH3PXFWgeTyj988Vf4sSb6ZPkcISQlGWLLddneiEIXMbyponDwJjLJhFTML4Fm84oKQ%2fiAeHTRXCXWbRJLEa7H6blKJnFM%2fDOLIZJk%2b%2fZ9z74SeQtiHBp7aXO5VLQxlJvgi%2bn%2bQTbjQcM%3d&lt;/a&gt;</Paymentlink></service_response><service_status diffgr:id="service_status1" msdata:rowOrder="0" diffgr:hasChanges="inserted"><service_return_code>0</service_return_code><service_msg>Success</service_msg></service_status></NMFIISERVICES>'
parseString(xml,parseStringOptions, function (err, result) {
  var _obj = result.NMFIISERVICES.service_response
  var _objStatus = result.NMFIISERVICES.service_status

  // console.log('to json',result.NMFIISERVICES)
  var config = require('../../configs/default.json')
  var DB = require('../db')
  _ = require('underscore')
  var db = new DB(config['development'].db)
  var extras = {
		"admin_advisor_id":1,
    "client_id":123,
    "trxn_type":"P",
    "iin":13456879
	}
  db.insertTransaction(result.NMFIISERVICES,extras)
  .then(function(result){
  	console.log('result',result);
  })

});
