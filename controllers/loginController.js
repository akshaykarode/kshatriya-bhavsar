var jwt  = require('jsonwebtoken');
var Helpers = require('./../modules/helpers');
var jwtconfig = require('./../configs/jwt-config.json')

var nseApi = require('./../modules/nse-api'),
    dataHandler = nseApi.JSONXMLHandler,
    _NSE_Master = new nseApi.Master(nse_env),
    _NSE_Transaction = new nseApi.Transaction(nse_env);

exports.welcome = function(req, res ,next) {
  console.log('welcome')
  var index = './../views/index.html'
  res.render(index,{})
};

exports.login = function(req, res , next) {
  console.log('login',req.body)
  var user = req.body // accept all params from body
  var token = jwt.sign(user,jwtconfig.secrete,jwtconfig.tokenOptions); // create a token
  res.json({
    success: true,
    authtoken: token
  })
};

exports.autoLogin = function(req, res , next) {
  db.getFamilyIINMappings(req.body)
  .then(function(result){
    var credentials=(_.isArray(result) && result.length!=0)? result[0] : result
    if(req.body.login_type=="arn" && (result.length==0 || credentials.broker_code==null)){
      res.status(200).send({
        success: false,
        code:"no_b_c",
        details: "Broker Credentials Not Stored."
      })
    }else if(req.body.login_type=="ria" && (result.length==0 || credentials.ria_code==null)){
      res.status(200).send({
        success: false,
        code:"no_sb_c",
        details: "SubBroker Credentials Not Stored."
      })
    }else{
      res.status(200).send({
        success: true,
        credentials: credentials
      })
    }
  })
};

exports.verifyCredentials = function(req, res , next) {
  console.log('verifyCredentials ... ',req.body)
  var credentials={
    brokerCode:req.body.brokerCode,
    applicationId:req.body.applicationId,
    password:req.body.password,
    riaCode:req.body.riaCode,
    riaApplicationId:req.body.riaApplicationId,
    riaPassword:req.body.riaPassword,
    login_type:req.body.login_type
  }
  var defaultParams = Helpers.prepareGetRequestParams(credentials,true)
  var queryParams = Helpers.toQueryParams(defaultParams)
  _NSE_Master.getCountryMaster(queryParams)
  .then(function(xmlResponse){
    dataHandler.xmlTojson(xmlResponse)
      .then(function(toJson){
        var _data = toJson.NewDataSet
        if(_data.service_status.service_return_code==0){ // Valid Crendentials !
          console.log('Valid Crendentials !')
          var user = req.body // accept all params from body
          res.json({
            success: true,
            details:"Valid Crendentials !"
          })
        }else{ // Invalid Crendentials !
          console.log('Invalid Crendentials !')
          res.json({
            success: false,
            details: 'Invalid Crendentials !'
          })
        }
      },function(error){
        res.send(error)
      })
  },function(error){
    res.send(error)
  });
};

exports.status = function(req, res ,next) {
 	console.log('status')
  res.send('Environment : '+config.envName+' Application Id : ' + JSON.stringify(req.decoded.Appln_Id) + " : logged in.");
};

exports.logout = function(req, res , next) {
 	console.log('logout') // client just need to destroy token
  res.json({
    success: true,
    message: 'logout successfully'
  })
};
