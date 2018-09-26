// var jwt  = require('jsonwebtoken');
var Helpers = require('./../modules/helpers');
// var jwtconfig = require('./../configs/jwt-config.json')
var bcrypt = require('bcrypt');

exports.welcome = function(req, res ,next) {
  console.log('welcome')
  var index = './../views/index.html'
  res.render(index,{})
};

exports.login = function(req, res , next) {
  console.log('login',req.body)
  // var user = req.body // accept all params from body
  // Load hash from your password DB.
  // req.body.password='abc123'
  var hash='$2b$10$TIKHatx/F3Cl7eEHEMqYjuE5PdvO/zpfa6W0TNgVM6h3LaPnXUTDe'
  
  bcrypt.compare(req.body.password, hash, function(err, response) {
    // response == true
    if(response==true){
      req.session.user=req.body
      res.status(200).send("LoggedIn Successfully !")
    }else{
      res.status(400).send("Incorrect Username Or Password !")
    }
  });
};

exports.status = function(req, res ,next) {
 	console.log('status')
  // res.send('Environment : '+config.envName+' User : ' + JSON.stringify(req.session.user) + " : logged in.");
  // MODELS.RoleMaster.findAll().then(roles => {
  //   console.log('roles',roles)
  //   res.send(roles)
  // })
  MODELS.Users.findAll({
      include: [
        {
          model: MODELS.RoleMaster
        }
      ]
    }).then(users => {
    console.log('users',users)
    res.send(users)
  })
};

exports.logout = function(req, res , next) {
 	console.log('logout') // destroy session
  req.session.destroy(function(err) {
    // cannot access session here
    if(err){
      res.json({
        success: false,
        message: err
      })  
    }else{
      res.json({
        success: true,
        message: 'logout successfully'
      })
    }
  })
};
