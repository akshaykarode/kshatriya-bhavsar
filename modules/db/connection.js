var mysql = require('mysql');
 
function Connection(config) { 
  this.pool = null;
  this.pool = mysql.createPool(config)
  
  this.pool.getConnection(function(err, connection) {
    if(err){
  		console.log('config : ',config)  
  		console.log('ERROR:',err)
    }else{
  		console.log('Database : ',config.database ,' connected successfully !')  
    }
  });
  return this;
}

Connection.prototype.acquire = function(callback) {
  this.pool.getConnection(function(err, connection) {
    callback(err, connection);
  });
};

module.exports = Connection;