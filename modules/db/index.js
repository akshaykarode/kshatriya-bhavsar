var Connection = require('./connection'),
    forEach = require('async-foreach').forEach;
    Q = require('q');

function Database(dbConfig) {
  this.connection = new Connection(dbConfig)
  /* Initiating Globals */
  // this._BANKS=[]
  /* Initiating Globals End */
  return this;
}
/* ----------------- CREDENTIALS MAP ----------------- */
Database.prototype.getCredentials = function(obj) {
  var deferred = Q.defer();
  var that=this;
  var queryBroker = '';
  var querySubBroker = '';

  var list=[obj.teamMemberSessionId].concat(_.map(obj.teamHierarchyList,o=>{return o.teamMemberId}))
  switch(obj.roleId){
    case 0: // TM
          queryBroker='SELECT * FROM `tp_nse_credentials` WHERE `advisor_id` = '+obj.advisorId;
          querySubBroker='SELECT * FROM `tp_nse_subbroker_mapping` WHERE team_member_session_id IN ('+list+')'
          break;
    case 2: // Client
          queryBroker='SELECT '+
            'sb.tp_nse_credentials_id, '+
            'c.* from `tp_nse_subbroker_mapping` sb '+
            'INNER JOIN tp_nse_credentials c '+
            'ON '+
            'sb.tp_nse_credentials_id = c.tp_nse_credentials_id '+
            'AND sb.team_member_session_id = '+obj.teamMemberSessionId+' limit 1';
          querySubBroker='SELECT *'+
           ' from `tp_nse_subbroker_mapping`'+
           'WHERE team_member_session_id = '+obj.teamMemberSessionId+';';
          break;
    case 3: // Advisor
          queryBroker='SELECT * FROM `tp_nse_credentials` WHERE `advisor_id` = '+obj.advisorId;
          querySubBroker='SELECT * FROM `tp_nse_subbroker_mapping` WHERE `advisor_id` = '+obj.advisorId;
          break;
    default:break;
  }
  function call(query){
    console.log("query",query)
    var d = Q.defer();
    that.connection.acquire(function(err, con) {
      con.query(query, function(err, result) {
        con.release();
        d.resolve(result)
      });
    });
    return d.promise;
  }
  Q.all([
      call(queryBroker),
      call(querySubBroker)
    ]).then(function(results){
      deferred.resolve({
        brokers:results[0],
        subbrokers:results[1]
      })
    })
  return deferred.promise;
};
Database.prototype.getCredentialsForAll = function(obj) {
  /*
  This is created for frontend requirement 
  to get all credentials 
  irrespective of frontend login (roleId)initally,
  for merging purpose.
  */
  var deferred = Q.defer();
  var that=this;
  var queryBroker='SELECT * FROM `tp_nse_credentials` WHERE `advisor_id` = '+obj.advisorId;
  var querySubBroker='SELECT * FROM `tp_nse_subbroker_mapping` WHERE `advisor_id` = '+obj.advisorId;

  function call(query){
    console.log("query",query)
    var d = Q.defer();
    that.connection.acquire(function(err, con) {
      con.query(query, function(err, result) {
        con.release();
        d.resolve(result)
      });
    });
    return d.promise;
  }
  Q.all([
      call(queryBroker),
      call(querySubBroker)
    ]).then(function(results){
      deferred.resolve({
        brokers:results[0],
        subbrokers:results[1]
      })
    })
  return deferred.promise;
};
Database.prototype.insertCredentials = function(credentials) {
  var that=this;
  var deferred = Q.defer();
  var selectQuery = 
      'SELECT `tp_nse_credentials_id` FROM `tp_nse_credentials` WHERE `broker_code`="'+credentials.brokerCode+'" AND `application_id`="'+credentials.applicationId+'" AND `password`="'+credentials.password+'"'
  var insertQuery = 
      "INSERT INTO `tp_nse_credentials` (`tp_nse_credentials_id`,`advisor_id`,`broker_code`,`application_id`,`password`,`ria_code`,`ria_application_id`,`ria_password`,`default_login`) VALUES ? "
  
  console.log("selectQuery:",selectQuery)
  console.log("insertQuery:",insertQuery)
  console.log("1")
  var _valuesDataCredentials=[_.values({
    "tp_nse_credentials_id":null,
    "advisor_id":credentials.advisorId,
    "broker_code":credentials.brokerCode,
    "application_id":credentials.applicationId,
    "password":credentials.password,
    "ria_code":credentials.riaCode,
    "ria_application_id":credentials.riaApplicationId,
    "ria_password":credentials.riaPassword,
    "default_login":credentials.defaultLogin,
  })]
  console.log("2")
  console.log(_valuesDataCredentials)
  this.connection.acquire(function(err, selectcon) {
    console.log("selectQuery")
    selectcon.query(selectQuery, function(err, selectResult) {
      selectcon.release();
      console.log("selectResult",selectResult)
      if(selectResult.length>0){
        deferred.resolve(selectResult[0].tp_nse_credentials_id)
      }else{
        that.connection.acquire(function(err, inscon) {
          console.log("insertQuery")
          inscon.query(insertQuery,[_valuesDataCredentials],function(err, insertResult) {
            inscon.release();
            if (err) {
              console.log('tp_nse_credentials Insert ERROR.',err)
              deferred.reject(err)
            } else {
              console.log('tp_nse_credentials ',insertResult)
              deferred.resolve(insertResult.insertId)
            }
          })
        });
      }
    });
  });
  return deferred.promise;
};
Database.prototype.mapCredentials = function(obj,arr) {
  var deferred = Q.defer();
  var iins=_.map(_.filter(arr,{broker_code:null}),function(o){return o.tp_nse_family_iin_mapping_id}).join()
  if(iins.length==0 || obj==null){
    deferred.resolve([])
  }else{
    var query = 
      'UPDATE `tp_nse_family_iin_mapping` SET `broker_code`="'+obj.brokerCode+'",`application_id`="'+obj.applicationId+'",`password`="'+obj.password+'" WHERE `tp_nse_family_iin_mapping_id`IN ('+iins+')'
    this.connection.acquire(function(err, con) {
      con.query(query, function(err, result) {
        con.release();
        deferred.resolve(result)
      });
    });
  }
  return deferred.promise;
};
Database.prototype.getFamilyIINMappings = function(obj) {
  var deferred = Q.defer();
  var query = '';
  if(obj.advisorId){
    var list=[obj.teamMemberSessionId].concat(_.map(obj.teamHierarchyList,o=>{return o.teamMemberId}))
    // query = 'SELECT * FROM `tp_nse_family_iin_mapping` WHERE client_id '+
    //         'IN '+
    //         '(SELECT client_id FROM users WHERE team_member_session_id IN ('+list+') ) limit 1 ';
    query = 
      'SELECT '+
      'fim.tp_nse_family_iin_mapping_id,fim.family_member_id,fim.client_id,fim.iin,fim.tax_status_desc,fim.holding_nature_code,fim.holding_nature_desc,fim.activation_status,fim.tp_nse_credentials_id, '+
      'c.broker_code,c.application_id,c.password,c.ria_code,c.ria_application_id,c.ria_password from `tp_nse_family_iin_mapping` fim '+
      'INNER JOIN tp_nse_credentials c '+
      'ON '+
      'fim.tp_nse_credentials_id = c.tp_nse_credentials_id '+
      'AND fim.client_id IN '+
      '(SELECT client_id FROM users WHERE team_member_session_id IN ('+list+') ) limit 1 ';
  }else{
    // query = 'SELECT * from `tp_nse_family_iin_mapping` WHERE client_id="'+obj.clientId+'"';
    query = 
      'SELECT '+
      'fim.tp_nse_family_iin_mapping_id,fim.family_member_id,fim.client_id,fim.iin,fim.tax_status_desc,fim.holding_nature_code,fim.holding_nature_desc,fim.activation_status,fim.tp_nse_credentials_id, '+
      'c.broker_code,c.application_id,c.password,c.ria_code,c.ria_application_id,c.ria_password from `tp_nse_family_iin_mapping` fim '+
      'INNER JOIN tp_nse_credentials c '+
      'ON '+
      'fim.tp_nse_credentials_id = c.tp_nse_credentials_id '+
      'AND fim.client_id IN ('+obj.clientId+')'
  }

  console.log("getFamilyIINMappings query",query)
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};

Database.prototype.getBrokersCredentials = function(obj) {
  var deferred = Q.defer();
  var query = 'SELECT * FROM `tp_nse_credentials` WHERE `advisor_id` = '+obj.advisorId;
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.updateBrokersCredentials = function(obj) {
  var deferred = Q.defer();
  var dualQuery = 
      "INSERT INTO `tp_nse_credentials` "+
      "(tp_nse_credentials_id,advisor_id,broker_code,application_id,password,ria_code,ria_application_id,ria_password,default_login) "+
      "VALUES ? "+
      "ON DUPLICATE KEY UPDATE "+
      "tp_nse_credentials_id = '"+obj.tp_nse_credentials_id+"' "+
      ",advisor_id= '"+obj.advisorId+"' "+
      ",broker_code= '"+obj.brokerCode+"' "+
      ",application_id= '"+obj.applicationId+"' "+
      ",password= '"+obj.password+"' "+
      ",ria_code= '"+obj.riaCode+"' "+
      ",ria_application_id= '"+obj.riaApplicationId+"' "+
      ",ria_password= '"+obj.riaPassword+"' "+
      ",default_login= '"+obj.defaultLogin+"' ";
  dualQuery=dualQuery.replace(/\'null\'/g,'null')
  console.log("dualQuery",dualQuery)
  this.connection.acquire(function(err, con) {
    con.query(dualQuery, 
      [
        [
          [
            obj.tp_nse_credentials_id,
            obj.advisorId,
            obj.brokerCode,
            obj.applicationId,
            obj.password,
            obj.riaCode,
            obj.riaApplicationId,
            obj.riaPassword,
            obj.defaultLogin
          ]
        ]
      ], function(err, result) {
        con.release();
        if(err){
          console.log('tp_nse_credentials Update ERROR.',err)
          deferred.reject(err)
        }else{
          deferred.resolve(result)
        }
    })
  });
  return deferred.promise;
};
Database.prototype.removeBrokersCredentials = function(obj) {
  var deferred = Q.defer();
  var queryDeleteBrokers = 'DELETE FROM tp_nse_credentials '+
  'WHERE tp_nse_credentials_id='+obj.tp_nse_credentials_id+';' 
  var queryDeleteSubBrokers = 'DELETE FROM tp_nse_subbroker_mapping '+
  'WHERE tp_nse_credentials_id='+obj.tp_nse_credentials_id+';' 
  var queryDeleteIINMappings = 'DELETE FROM tp_nse_family_iin_mapping '+
  'WHERE tp_nse_credentials_id='+obj.tp_nse_credentials_id+';'
  this.connection.acquire(function(err, con) {
    con.query(queryDeleteIINMappings, function(err1, result1) {
      con.query(queryDeleteSubBrokers, function(err2, result2) {
        con.query(queryDeleteBrokers, function(err3, result3) {
          con.release();
          deferred.resolve([result1,result2,result3])
        });
      });
    });
  });
  return deferred.promise;
};
Database.prototype.getSubBrokersCredentials = function(obj) {
  var deferred = Q.defer();
  var query = 'SELECT * FROM `tp_nse_subbroker_mapping` WHERE `advisor_id` = '+obj.advisorId;
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.updateSubBrokersCredentials = function(obj) {
  var deferred = Q.defer();
  var dualQuery = 
      "INSERT INTO `tp_nse_subbroker_mapping` "+
      "(tp_nse_subbroker_mapping_id,advisor_id,team_member_session_id,tp_nse_credentials_id,euin,sub_broker_code) "+
      "VALUES ? "+
      "ON DUPLICATE KEY UPDATE "+
      "tp_nse_subbroker_mapping_id = '"+obj.tp_nse_subbroker_mapping_id+"' "+
      ",advisor_id= '"+obj.advisorId+"' "+
      ",team_member_session_id= '"+obj.teamMemberSessionId+"' "+
      ",tp_nse_credentials_id= '"+obj.tp_nse_credentials_id+"' "+
      ",euin= '"+obj.euin+"' "+
      ",sub_broker_code= '"+obj.subBrokerCode+"' ";
  dualQuery=dualQuery.replace(/\'null\'/g,'null')
  console.log("dualQuery",dualQuery)
  this.connection.acquire(function(err, con) {
    con.query(dualQuery, 
      [
        [
          [
            obj.tp_nse_subbroker_mapping_id,
            obj.advisorId,
            obj.teamMemberSessionId,
            obj.tp_nse_credentials_id,
            obj.euin,
            obj.subBrokerCode,
          ]
        ]
      ], function(err, result) {
        con.release();
        if(err){
          console.log('tp_nse_subbroker_mapping Update ERROR.',err)
          deferred.reject(err)
        }else{
          deferred.resolve(result)
        }
    })
  });
  return deferred.promise;
};
Database.prototype.removeSubBrokersCredentials = function(obj) {
  var deferred = Q.defer();
  var query = 'DELETE FROM `tp_nse_subbroker_mapping` WHERE `tp_nse_subbroker_mapping_id` = '+obj.tp_nse_subbroker_mapping_id;
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
/* ----------------- IIN ----------------- */
Database.prototype.getIINs = function(obj) {
  var deferred = Q.defer();
  var query = '';
  if(obj.admin_advisor_id){
    var list=[obj.teamMemberSessionId].concat(_.map(obj.teamHierarchyList,o=>{return o.teamMemberId}))
    query = 
      'SELECT T2.*,fm.full_name,I1.admin_advisor_id as advisor_id,fm.family_member_id,fm.client_id,fm.pan  '+
      'FROM family_members fm '+
      'INNER JOIN (SELECT client_id,admin_advisor_id FROM users WHERE team_member_session_id IN ('+list+')) I1 '+
      'ON '+
      'I1.client_id=fm.client_id '+
      'LEFT JOIN tp_nse_family_iin_mapping T2  '+
      'ON I1.client_id=T2.client_id AND fm.family_member_id=T2.family_member_id ';
  }else{
    query = 
      'SELECT T1.full_name,T2.*,T1.family_member_id,T1.client_id,T1.pan FROM '+
      '(SELECT full_name,family_member_id,client_id,pan FROM family_members T1 WHERE client_id='+obj.client_id+') T1 '+
      'LEFT JOIN tp_nse_family_iin_mapping T2 '+
      'ON '+ 
      'T1.client_id=T2.client_id AND T1.family_member_id=T2.family_member_id'
  }

  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.insertIINsMapping = function(arr,credentials) {
  var deferred = Q.defer();
  var that=this;
  var _valuesDataMapping=[]
  console.log("credentials",credentials)
  if(arr.length>0){
    console.log("here")
    this.insertCredentials(credentials)
    .then(function(credentials_id){
      console.log("insertCredentials credentials",credentials_id)
      for(var i=0;i<arr.length;i++){
        _valuesDataMapping[i] = _.values({
          "family_member_id": arr[i].family_member_id,
          "client_id": arr[i].client_id,
          "iin": arr[i].iin,
          "tax_status_desc":arr[i].TAX_STATUS_DESC,
          "holding_nature_code":arr[i].HOLD_N_CODE,
          "holding_nature_desc":arr[i].HOLD_NATURE_DESC,
          "activation_status":arr[i].ACTIVATION_STATUS,
          "advisor_id":arr[i].advisor_id,
          "tp_nse_credentials_id":credentials_id,
        });
        console.log('->',_valuesDataMapping[i])
      }
      var insertQuery = 
        'INSERT INTO tp_nse_family_iin_mapping (family_member_id,client_id,iin,tax_status_desc,holding_nature_code,holding_nature_desc,activation_status,advisor_id,tp_nse_credentials_id) VALUES ?'
      that.connection.acquire(function(err, con) {
        console.log("insert in mapping")
        con.query(insertQuery, [_valuesDataMapping], function(err, result) {
          con.release();
          if (err) {
            console.log('tp_nse_family_iin_mapping Insert ERROR.')
            deferred.resolve({success:false,error:err})
          } else {
            console.log('tp_nse_family_iin_mapping ',result)
            deferred.resolve({success:true,data:result})
          }
        });
      });
    })

  }else{
    console.log("resolve:insertIINsMapping")
    deferred.resolve({success:true,data:[]})
  }
  return deferred.promise;
};
Database.prototype.updateIINsMapping = function(arr,credentials) {
  var deferred = Q.defer();
  console.log("updateIINsMapping")
  if(arr.length>0){
    this.connection.acquire(function(err, con) {
      forEach(arr,function(row){
        console.log("****row",row)
        var done = this.async()
        con.query('UPDATE tp_nse_family_iin_mapping SET '+
          ' family_member_id=?,'+
          ' client_id=?,'+
          ' iin=?,'+
          ' tax_status_desc=?,'+
          ' holding_nature_code=?,'+
          ' holding_nature_desc=?,'+
          ' activation_status=?,'+
          ' advisor_id=?,'+
          ' tp_nse_credentials_id=?'+
         ' WHERE tp_nse_family_iin_mapping_id=?', 
          [
            row.family_member_id,
            row.client_id,
            row.iin,
            row.TAX_STATUS_DESC,
            row.HOLD_N_CODE,
            row.HOLD_NATURE_DESC,
            row.ACTIVATION_STATUS,
            row.advisor_id,
            row.tp_nse_credentials_id,
            row.tp_nse_family_iin_mapping_id
          ], function(err, result) {
          if (err) {
            console.log('tp_nse_family_iin_mapping Update ERROR.',err)
          }
          done()
        });
      },function(){ // alldone
        con.release();
        console.log('all IINsMappings upadted successfully')
        deferred.resolve({success:true})
      })
    });
  }else{
    console.log("resolve:insertIINsMapping")
    deferred.resolve({success:true,data:[]})
  }
  // var _valuesData=[]
  // for(var i=0;i<arr.length;i++){
  //   _valuesData[i] = _.values({
  //     "tp_nse_family_iin_mapping_id":arr[i].tp_nse_family_iin_mapping_id,
  //     "family_member_id": arr[i].family_member_id,
  //     "client_id": arr[i].client_id,
  //     "iin": arr[i].iin,
  //     "tax_status_desc":arr[i].TAX_STATUS_DESC,
  //     "holding_nature_code":arr[i].HOLD_N_CODE,
  //     "holding_nature_desc":arr[i].HOLD_NATURE_DESC,
  //     "activation_status":arr[i].ACTIVATION_STATUS,
  //     "broker_code":credentials.brokerCode,
  //     "application_id":credentials.applicationId,
  //     "password":credentials.password,
  //   });
  // }

  // this.connection.acquire(function(err, con) {
  //   con.query('INSERT INTO tp_nse_family_iin_mapping (family_member_id,client_id,iin,tax_status_desc,holding_nature_code,holding_nature_desc,activation_status,broker_code,application_id,password) VALUES ?', [_valuesData], function(err, result) {
  //     con.release();
  //     if (err) {
  //       console.log('tp_nse_amc_master Insert ERROR.')
  //       deferred.resolve({success:false,error:err})
  //     } else {
  //       console.log('tp_nse_amc_master ',result)
  //       deferred.resolve({success:true,data:result})
  //     }
  //   });
  // });
  return deferred.promise;
};
/* ----------------- BANK ----------------- */
Database.prototype.getAllBanks = function(obj) {
  var deferred = Q.defer();
  var query = 'SELECT * FROM tp_nse_bank_master'
  this.connection.acquire(function(err, con) {
    console.log("connection",con)
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
/* ----------------- AMC ----------------- */
Database.prototype.getAllAmcs = function(obj) {
  var deferred = Q.defer();
  var query = 'SELECT * FROM tp_nse_amc_master'
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.getEmpanelledAmcs = function(obj) {
  var deferred = Q.defer();
  var query = 'SELECT * FROM tp_nse_empanelled_amc WHERE admin_advisor_id='+(obj.admin_advisor_id || null);
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.insertEmpanelAmc = function(obj) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    con.query('SELECT EXISTS (SELECT * FROM tp_nse_empanelled_amc WHERE admin_advisor_id=? AND amc_code=? ) AS result;',[obj.admin_advisor_id,obj.amc_code],function(err, result){
      if(result[0].result==1){ // is exist
        console.log('already exist')
        deferred.resolve({success:true})  
      }else{ // non exist
        var _valuesData=[]
        _valuesData.push(_.values({
          "admin_advisor_id": obj.admin_advisor_id,
          "amc_code": obj.amc_code
        }))
        
        con.query('INSERT INTO tp_nse_empanelled_amc (admin_advisor_id,amc_code) VALUES ?', [_valuesData], function(err, result) {
          if (err) {
            console.log('tp_nse_empanelled_amc Insert ERROR.',err)
            deferred.resolve({success:false,error:err})
          } else {
            console.log('tp_nse_empanelled_amc ',result)
            deferred.resolve({success:true,id:result.insertId})
          }
      });
      }
    })  
  });
  return deferred.promise;
};
Database.prototype.deleteEmpanelAmc = function(obj) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    con.query('DELETE FROM tp_nse_empanelled_amc WHERE tp_nse_empanelled_amc_id=?', [obj.tp_nse_empanelled_amc_id], function(err, result) {
      con.release();
      if (err) {
        console.log('tp_nse_amc_master Delete ERROR.')
        deferred.resolve({success:false,error:err})
      } else {
        console.log('tp_nse_amc_master ',result)
        deferred.resolve({success:true,data:result})
      }
    })
  });
  return deferred.promise;
};

/* ----------------- EMAILS ----------------- */
Database.prototype.getVerifiedEmail = function(adminAdvisorId) {
  var deferred = Q.defer();
  var query = 
  'SELECT * FROM admin_advisor_verified_mails '+
  'WHERE admin_advisor_id='+adminAdvisorId+' AND verification_status="Success"'

  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
/* ----------------- REFLOW ----------------- */
Database.prototype.remapFolios = function(iinFolios) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    forEach(iinFolios,function(iinFolio){
      var done=this.async()
      var query=
      'INSERT INTO tp_nse_folio_iin_mapping (`family_member_id`,`folio_number`,`iin`) '+
      'SELECT * FROM (SELECT "'+iinFolio.family_member_id+'","'+iinFolio.folio_number+'","'+iinFolio.iin+'") AS tmp '+
      'WHERE NOT EXISTS ( '+
          'SELECT tp_nse_folio_iin_mapping_id FROM tp_nse_folio_iin_mapping  WHERE `family_member_id`="'+iinFolio.family_member_id+'" AND `folio_number`="'+iinFolio.folio_number+'" AND `iin`="'+iinFolio.iin+'" '+
      ') LIMIT 1;'
      con.query(query,function(err, result) {
        if(err){
          console.log('tp_nse_folio_iin_mapping Insert/Update ERROR.',err)
          done(err)
        }else{
          done(result)
        }
      })
    },function(allResult){ // alldone
      con.release();
      console.log('all IIN-FOLIO Mappings upadted successfully')
      deferred.resolve({success:true,results:allResult})
    })
  });
  return deferred.promise;
};
Database.prototype.mapIINFolio = function(iinFolios) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    con.query('SELECT EXISTS (SELECT * FROM tp_nse_folio_iin_mapping WHERE family_member_id=? AND folio_number=? AND iin=?) AS result;',[obj.family_member_id,obj.folio_number,obj.iin],function(err, result){
      if(result[0].result==1){ // is exist
        console.log('already exist')
        con.release();
        deferred.resolve({success:true,msg:"already exist"})
      }else{ // non exist
        var _valuesData=[]
        _valuesData.push(_.values({
          "tp_nse_product_master_id": obj.tp_nse_folio_iin_mapping_id || null,
          "family_member_id": obj.family_member_id,
          "folio_number": obj.folio_number,
          "iin": obj.iin
        }))
        
        con.query('INSERT INTO tp_nse_folio_iin_mapping (family_member_id,folio_number,iin) VALUES ?', [_valuesData], function(err, result) {
          if (err) {
            console.log('tp_nse_folio_iin_mapping Insert ERROR.',err)
            con.release();
            deferred.resolve({success:false,error:err})
          } else {
            console.log('tp_nse_folio_iin_mapping ',result)
            deferred.resolve({success:true,id:result.insertId})
          }
        });
      }
    })  
  });
  return deferred.promise;
};
Database.prototype.getUnmappedFolios = function(obj) {
  var deferred = Q.defer();
  var query = 
  'SELECT amf.family_member_id,amf.folio_number,amf.scheme_name FROM asset_mutual_fund amf '+
  'LEFT OUTER JOIN tp_nse_folio_iin_mapping tfim '+
  'ON '+
  'amf.folio_number=tfim.folio_number '+
  'WHERE '+
  'amf.family_member_id="'+obj.familyMemberId+'" AND tfim.folio_number IS NULL '+
  'GROUP BY amf.folio_number';

  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.getWbr9Folios = function(obj) {
  var deferred = Q.defer();
  var query = 
  'SELECT folio_number,scheme_code,investor_name,mode_of_hold,pan,joint_name_1,joint_1_pan,joint_name_2,joint_2_pan,guardian_pan, '+
  'family_member_id FROM `wbr9` WHERE `family_member_id` = "'+obj.familyMemberId+'" ';
  // console.log('***query',query)  
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.getSchemesByFM = function(obj,pm_query,plm_query) {
  var deferred = Q.defer();
  var query = 
    'SELECT R7.*,amfcm.asset_mutual_fund_category_name from asset_mutual_fund_category_master amfcm '+
    'INNER JOIN '+
    '( '+
    'SELECT R6.*,amfscm.asset_mutual_fund_category_master_id,amfscm.asset_mutual_fund_sub_category_name from asset_mutual_fund_sub_category_master amfscm '+
    'INNER JOIN '+
    '( '+
    'SELECT R5.*,tnplm.registrar_id,tnplm.trxn_type,tnplm.sub_trxn_type,tnplm.sub_trxn_type_desc,tnplm.minimum_amount,tnplm.maximum_amount,tnplm.min_units,tnplm.multiples from tp_nse_product_limit_master tnplm '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R4.*,tnpm.* from tp_nse_product_master tnpm '+
    'INNER JOIN '+
    '( '+
    'SELECT R3.*,amfm.asset_mutual_fund_sub_category_master_id,amfm.tp_nse_amc_code,amfm.tp_nse_product_code,amfm.nav_date,amfm.nav,(R3.balance_units*amfm.nav) as current_value FROM asset_mutual_fund_master amfm '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R00.*,w.mode_of_hold,w.uin_no,w.pan,w.joint_1_pan,w.joint_2_pan,w.guardian_pan from wbr9 w '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R2.asset_id,R2.family_member_id,R2.asset_mutual_fund_transaction_type_master_id, '+
    'R2.folio_number,R2.scheme_code,SUM(bu) as balance_units FROM '+
    '( '+
    'SELECT R1.*,amfttm.effect,(R1.units*amfttm.effect) as bu FROM asset_mutual_fund_transaction_type_master amfttm '+
    'INNER JOIN '+
    '( '+
    'SELECT R0.*,amf.family_member_id from asset_mutual_fund amf '+
    'INNER JOIN '+
    '(SELECT asset_id,asset_mutual_fund_transaction_type_master_id,folio_number,units,scheme_code from asset_mutual_fund_transactions  '+
    'WHERE FIND_IN_SET( r_t,  "CAMS,FRANKLIN_TEMPLETON,KARVY,SUNDARAM" ) >0 '+
    'AND asset_id '+
    'IN '+
    '(SELECT asset_id from asset WHERE client_id = '+obj.clientId+' '+
    ')) R0 '+
    'ON '+
    'amf.asset_id = R0.asset_id AND amf.family_member_id = '+obj.familyMemberId+' '+
    ') R1 '+
    'ON '+
    'amfttm.asset_mutual_fund_transaction_type_master_id = R1.asset_mutual_fund_transaction_type_master_id ) R2 '+
    'GROUP BY asset_id '+
    ') R00 '+
    'ON '+
    'w.asset_id = R00.asset_id AND w.folio_number = R00.folio_number '+
    ') R3 '+
    'ON '+
    'amfm.scheme_code = R3.scheme_code '+
    ') R4 '+
    'ON '+
    pm_query+
    'IF(FIND_IN_SET(tnpm.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
    ',IF(length(CONCAT(tnpm.amc_code,tnpm.product_code))=7 '+
      ',CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code '+
      ',IF(length(CONCAT(tnpm.amc_code,tnpm.product_code))>7, '+
        'IF(SUBSTRING(CONCAT(tnpm.amc_code,tnpm.product_code),1,8) = R4.scheme_code '+
          ',true '+
          ',IF(SUBSTRING(CONCAT(tnpm.amc_code,tnpm.product_code),1,7) = R4.scheme_code,true,false) '+
          ') '+
        ',CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code) '+
      ') '+
    ',IF(tnpm.amc_code = "FTI", '+
      'tnpm.product_code = R4.tp_nse_product_code, '+
      'CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code '+
      ') ) '+
    ') R5 '+
    'ON '+
    plm_query+
    'IF(FIND_IN_SET(tnplm.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
    ',IF(length(CONCAT(tnplm.amc_code,tnplm.product_code))=7 '+
      ',CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code '+
      ',IF(length(CONCAT(tnplm.amc_code,tnplm.product_code))>7, '+
        'IF(SUBSTRING(CONCAT(tnplm.amc_code,tnplm.product_code),1,8) = R5.scheme_code '+
          ',true '+
          ',IF(SUBSTRING(CONCAT(tnplm.amc_code,tnplm.product_code),1,7) = R5.scheme_code,true,false) '+
          ') '+
        ',CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code) '+
      ') '+
    ',IF(tnplm.amc_code = "FTI", '+
      'tnplm.product_code = R5.tp_nse_product_code, '+
      'CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code '+
      ') ) '+
    ') R6 '+
    'ON '+
    'R6.asset_mutual_fund_sub_category_master_id = amfscm.asset_mutual_fund_sub_category_master_id '+
    ') R7 '+
    'ON '+
    'R7.asset_mutual_fund_category_master_id = amfcm.asset_mutual_fund_category_master_id '

  // console.log('***query',query)  
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.getIINByFolio = function(obj) {
  var deferred = Q.defer();
  // var query = 'SELECT iin FROM `tp_nse_folio_iin_mapping` WHERE folio_number = "'+obj.folioNumber+'"';
  var query = 
   'SELECT tfim.folio_number,fm.full_name,tfip.*,tc.* FROM `tp_nse_folio_iin_mapping` tfim '+
   'INNER JOIN tp_nse_family_iin_mapping tfip '+
   'ON '+
   'tfim.iin=tfip.iin '+
   'INNER JOIN family_members fm '+
   'ON '+
   'tfip.family_member_id=fm.family_member_id '+
   'INNER JOIN tp_nse_credentials tc '+
   'ON '+
   'tfip.tp_nse_credentials_id=tc.tp_nse_credentials_id '+
   'WHERE tfim.folio_number = "'+obj.folioNumber+'" ';
    
  // console.log('***query',query)  
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.getIINByFM = function(obj) {
  var deferred = Q.defer();
  var query = 
  'SELECT fm.full_name,tfip.*,tc.*,tsm.* FROM family_members fm '+
  'INNER JOIN tp_nse_family_iin_mapping tfip '+
  'ON '+
  'fm.family_member_id=tfip.family_member_id '+
  'INNER JOIN tp_nse_credentials tc '+
  'ON '+
  'tfip.tp_nse_credentials_id=tc.tp_nse_credentials_id '+
  'INNER JOIN tp_nse_subbroker_mapping tsm '+
  'ON '+
  'tfip.tp_nse_credentials_id=tsm.tp_nse_credentials_id '+
  'WHERE tfip.family_member_id ="'+obj.familyMemberId+'"';
    
  // console.log('***query',query)  
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
/* ----------------- SCHEME ----------------- */
Database.prototype.searchSchemes = function(obj,pm_query,plm_query) {
  var deferred = Q.defer();
  var checkQuery =
  'SELECT IF(tc.broker_code IS NULL,"ria","arn") as result FROM tp_nse_credentials tc WHERE advisor_id='+obj.admin_advisor_id;
  
  this.connection.acquire(function(err, con) {
    con.query(checkQuery, function(err, checkQueryResult) {
      console.log("checkQueryResult",checkQueryResult)
      var res=_.uniq(checkQueryResult,'result')
      console.log("res",res)
      var login_type=(res.length==2)? 'both' : res[0].result;
      console.log("login_type",login_type)
      switch(login_type){
        case "arn":pm_query+='AND plan_type = "REGULAR" '; break;
        case "ria":pm_query+='AND plan_type = "DIRECT" '; break;
        case "both":pm_query+=''; break;
        default:pm_query+='AND plan_type = "REGULAR" ';
      }
      console.log("final pm_query",pm_query)
      var query = 
      'SELECT T02.*,T01.* from tp_nse_product_limit_master T01 '+
      'RIGHT JOIN '+
      '( '+
      'SELECT * FROM tp_nse_product_master WHERE amc_code '+
      'IN '+
      '(SELECT amc_code FROM tp_nse_empanelled_amc WHERE admin_advisor_id = '+(obj.admin_advisor_id || "")+') '+
      'AND '+
      'PRODUCT_LONG_NAME LIKE ? '+pm_query+'limit 50 '+
      ') T02 '+
      'ON '+plm_query+
      'CONCAT (T01.amc_code,T01.product_code) = CONCAT (T02.amc_code,T02.product_code) limit 50'
      con.query(query,'%'+obj.search+'%', function(err, result) {
        con.release();
        deferred.resolve(result)
      });
    })
  });
  return deferred.promise;
};
Database.prototype.searchCategorizedSchemes = function(obj) {
  console.log('searchCategorizedSchemes')
  var deferred = Q.defer();
  var query = 
  'SELECT T05.*,amfscm.asset_mutual_fund_category_name FROM '+
  '( '+
  'SELECT T04.*,amfscm.asset_mutual_fund_category_master_id,amfscm.asset_mutual_fund_sub_category_name FROM '+
  '( '+
  'SELECT T03.*,amfm.asset_mutual_fund_sub_category_master_id FROM '+
  '(SELECT T02.*,T01.registrar_id,T01.trxn_type,T01.sub_trxn_type,T01.sub_trxn_type_desc,T01.minimum_amount,T01.maximum_amount,T01.min_units,T01.multiples from tp_nse_product_limit_master T01 '+
  'RIGHT JOIN '+
  '( '+
  'SELECT * FROM tp_nse_product_master WHERE amc_code '+
  'IN '+
  '(SELECT amc_code FROM tp_nse_empanelled_amc WHERE admin_advisor_id = '+(obj.admin_advisor_id || "")+') '+
  'AND '+
  'PRODUCT_LONG_NAME LIKE ? limit 100 '+
  ') T02 '+
  'ON '+
  'CONCAT (T01.amc_code,T01.product_code) = CONCAT (T02.amc_code,T02.product_code) limit 100 '+
  ') T03 '+
  'INNER JOIN asset_mutual_fund_master amfm '+
  'ON '+
  'IF(FIND_IN_SET(T03.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
  ',IF(length(CONCAT (T03.amc_code,T03.product_code))=7 '+
    ',CONCAT (T03.amc_code,T03.product_code) = amfm.scheme_code '+
    ',IF(length(CONCAT (T03.amc_code,T03.product_code))>7, '+
      'IF(SUBSTRING(CONCAT (T03.amc_code,T03.product_code),1,8) = amfm.scheme_code '+
        ',true '+
        ',IF(SUBSTRING(CONCAT (T03.amc_code,T03.product_code),1,7) = amfm.scheme_code,true,false) '+
        ') '+
      ',CONCAT (T03.amc_code,T03.product_code) = amfm.scheme_code) '+
    ') '+
  ',IF(T03.amc_code = "FTI", '+
    'T03.product_code = amfm.tp_nse_product_code, '+
    'CONCAT(T03.amc_code,T03.product_code) = amfm.scheme_code '+
    ') ) '+
  ') T04 '+
  'INNER JOIN '+
  'asset_mutual_fund_sub_category_master amfscm '+
  'ON '+
  'T04.asset_mutual_fund_sub_category_master_id = amfscm.asset_mutual_fund_sub_category_master_id '+
  ') T05 '+
  'INNER JOIN '+
  'asset_mutual_fund_category_master amfscm '+
  'ON '+
  'T05.asset_mutual_fund_category_master_id = amfscm.asset_mutual_fund_category_master_id '
  
  // console.log('***query',query)

  this.connection.acquire(function(err, con) {
    con.query(query,'%'+obj.search+'%', function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.getExistingSchemes = function(obj,pm_query,plm_query) {
  var deferred = Q.defer();
  // var brokerCodeRegex = credentials.brokerCode.replace( /^\D+/g, '')
  var query = '';
  if(obj.admin_advisor_id){
    var list=[obj.teamMemberSessionId].concat(_.map(obj.teamHierarchyList,o=>{return o.teamMemberId}))
    query = 
    'SELECT R7.*,amfcm.asset_mutual_fund_category_name from asset_mutual_fund_category_master amfcm '+
    'INNER JOIN '+
    '( '+
    'SELECT R6.*,amfscm.asset_mutual_fund_category_master_id,amfscm.asset_mutual_fund_sub_category_name from asset_mutual_fund_sub_category_master amfscm '+
    'INNER JOIN '+
    '( '+
    'SELECT R5.*,tnplm.registrar_id,tnplm.trxn_type,tnplm.sub_trxn_type,tnplm.sub_trxn_type_desc,tnplm.minimum_amount,tnplm.maximum_amount,tnplm.min_units,tnplm.multiples from tp_nse_product_limit_master tnplm '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R4.*,tnpm.* from tp_nse_product_master tnpm '+
    'INNER JOIN '+
    '( '+
    'SELECT R3.*,amfm.asset_mutual_fund_sub_category_master_id,amfm.tp_nse_amc_code,amfm.tp_nse_product_code,amfm.nav_date,amfm.nav,(R3.balance_units*amfm.nav) as current_value FROM asset_mutual_fund_master amfm '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R00.*,w.mode_of_hold,w.uin_no,w.pan,w.joint_1_pan,w.joint_2_pan,w.guardian_pan from wbr9 w '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R2.asset_id,R2.family_member_id,R2.asset_mutual_fund_transaction_type_master_id, '+
    'R2.folio_number,R2.scheme_code,SUM(bu) as balance_units FROM '+
    '( '+
    'SELECT R1.*,amfttm.effect,(R1.units*amfttm.effect) as bu FROM asset_mutual_fund_transaction_type_master amfttm '+
    'INNER JOIN '+
    '( '+
    'SELECT R0.*,amf.family_member_id from asset_mutual_fund amf '+
    'INNER JOIN '+
    '(SELECT asset_id,asset_mutual_fund_transaction_type_master_id,folio_number,units,scheme_code from asset_mutual_fund_transactions  '+
    'WHERE FIND_IN_SET( r_t,  "CAMS,FRANKLIN_TEMPLETON,KARVY,SUNDARAM" ) >0 '+
    'AND asset_id '+
    'IN '+
    '(SELECT asset_id from asset WHERE client_id IN '+
    '(SELECT client_id from users WHERE team_member_session_id IN ('+list+') ) '+
    ')) R0 '+
    'ON '+
    'amf.asset_id = R0.asset_id '+
    ') R1 '+
    'ON '+
    'amfttm.asset_mutual_fund_transaction_type_master_id = R1.asset_mutual_fund_transaction_type_master_id ) R2 '+
    'GROUP BY asset_id '+
    ') R00 '+
    'ON '+
    'w.asset_id = R00.asset_id AND w.folio_number = R00.folio_number '+
    ') R3 '+
    'ON '+
    'amfm.scheme_code = R3.scheme_code '+
    ') R4 '+
    'ON '+
    pm_query+
    'IF(FIND_IN_SET(tnpm.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
    ',IF(length(CONCAT(tnpm.amc_code,tnpm.product_code))=7 '+
      ',CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code '+
      ',IF(length(CONCAT(tnpm.amc_code,tnpm.product_code))>7, '+
        'IF(SUBSTRING(CONCAT(tnpm.amc_code,tnpm.product_code),1,8) = R4.scheme_code '+
          ',true '+
          ',IF(SUBSTRING(CONCAT(tnpm.amc_code,tnpm.product_code),1,7) = R4.scheme_code,true,false) '+
          ') '+
        ',CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code) '+
      ') '+
    ',IF(tnpm.amc_code = "FTI", '+
      'tnpm.product_code = R4.tp_nse_product_code, '+
      'CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code '+
      ') ) '+
    ') R5 '+
    'ON '+
    plm_query+
    'IF(FIND_IN_SET(tnplm.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
    ',IF(length(CONCAT(tnplm.amc_code,tnplm.product_code))=7 '+
      ',CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code '+
      ',IF(length(CONCAT(tnplm.amc_code,tnplm.product_code))>7, '+
        'IF(SUBSTRING(CONCAT(tnplm.amc_code,tnplm.product_code),1,8) = R5.scheme_code '+
          ',true '+
          ',IF(SUBSTRING(CONCAT(tnplm.amc_code,tnplm.product_code),1,7) = R5.scheme_code,true,false) '+
          ') '+
        ',CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code) '+
      ') '+
    ',IF(tnplm.amc_code = "FTI", '+
      'tnplm.product_code = R5.tp_nse_product_code, '+
      'CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code '+
      ') ) '+
    ') R6 '+
    'ON '+
    'R6.asset_mutual_fund_sub_category_master_id = amfscm.asset_mutual_fund_sub_category_master_id '+
    ') R7 '+
    'ON '+
    'R7.asset_mutual_fund_category_master_id = amfcm.asset_mutual_fund_category_master_id '

  }else{
    query = 
    'SELECT R7.*,amfcm.asset_mutual_fund_category_name from asset_mutual_fund_category_master amfcm '+
    'INNER JOIN '+
    '( '+
    'SELECT R6.*,amfscm.asset_mutual_fund_category_master_id,amfscm.asset_mutual_fund_sub_category_name from asset_mutual_fund_sub_category_master amfscm '+
    'INNER JOIN '+
    '( '+
    'SELECT R5.*,tnplm.registrar_id,tnplm.trxn_type,tnplm.sub_trxn_type,tnplm.sub_trxn_type_desc,tnplm.minimum_amount,tnplm.maximum_amount,tnplm.min_units,tnplm.multiples from tp_nse_product_limit_master tnplm '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R4.*,tnpm.* from tp_nse_product_master tnpm '+
    'INNER JOIN '+
    '( '+
    'SELECT R3.*,amfm.asset_mutual_fund_sub_category_master_id,amfm.tp_nse_amc_code,amfm.tp_nse_product_code,amfm.nav_date,amfm.nav,(R3.balance_units*amfm.nav) as current_value FROM asset_mutual_fund_master amfm '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R00.*,w.mode_of_hold,w.uin_no,w.pan,w.joint_1_pan,w.joint_2_pan,w.guardian_pan from wbr9 w '+
    'RIGHT JOIN '+
    '( '+
    'SELECT R2.asset_id,R2.family_member_id,R2.asset_mutual_fund_transaction_type_master_id, '+
    'R2.folio_number,R2.scheme_code,SUM(bu) as balance_units FROM '+
    '( '+
    'SELECT R1.*,amfttm.effect,(R1.units*amfttm.effect) as bu FROM asset_mutual_fund_transaction_type_master amfttm '+
    'INNER JOIN '+
    '( '+
    'SELECT R0.*,amf.family_member_id from asset_mutual_fund amf '+
    'INNER JOIN '+
    '(SELECT asset_id,asset_mutual_fund_transaction_type_master_id,folio_number,units,scheme_code from asset_mutual_fund_transactions  '+
    'WHERE FIND_IN_SET( r_t,  "CAMS,FRANKLIN_TEMPLETON,KARVY,SUNDARAM" ) >0 '+
    'AND asset_id '+
    'IN '+
    '(SELECT asset_id from asset WHERE client_id = '+obj.client_id+' '+
    ')) R0 '+
    'ON '+
    'amf.asset_id = R0.asset_id '+
    ') R1 '+
    'ON '+
    'amfttm.asset_mutual_fund_transaction_type_master_id = R1.asset_mutual_fund_transaction_type_master_id ) R2 '+
    'GROUP BY asset_id '+
    ') R00 '+
    'ON '+
    'w.asset_id = R00.asset_id AND w.folio_number = R00.folio_number '+
    ') R3 '+
    'ON '+
    'amfm.scheme_code = R3.scheme_code '+
    ') R4 '+
    'ON '+
    pm_query+
    'IF(FIND_IN_SET(tnpm.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
    ',IF(length(CONCAT(tnpm.amc_code,tnpm.product_code))=7 '+
      ',CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code '+
      ',IF(length(CONCAT(tnpm.amc_code,tnpm.product_code))>7, '+
        'IF(SUBSTRING(CONCAT(tnpm.amc_code,tnpm.product_code),1,8) = R4.scheme_code '+
          ',true '+
          ',IF(SUBSTRING(CONCAT(tnpm.amc_code,tnpm.product_code),1,7) = R4.scheme_code,true,false) '+
          ') '+
        ',CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code) '+
      ') '+
    ',IF(tnpm.amc_code = "FTI", '+
      'tnpm.product_code = R4.tp_nse_product_code, '+
      'CONCAT(tnpm.amc_code,tnpm.product_code) = R4.scheme_code '+
      ') ) '+
    ') R5 '+
    'ON '+
    plm_query+
    'IF(FIND_IN_SET(tnplm.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
    ',IF(length(CONCAT(tnplm.amc_code,tnplm.product_code))=7 '+
      ',CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code '+
      ',IF(length(CONCAT(tnplm.amc_code,tnplm.product_code))>7, '+
        'IF(SUBSTRING(CONCAT(tnplm.amc_code,tnplm.product_code),1,8) = R5.scheme_code '+
          ',true '+
          ',IF(SUBSTRING(CONCAT(tnplm.amc_code,tnplm.product_code),1,7) = R5.scheme_code,true,false) '+
          ') '+
        ',CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code) '+
      ') '+
    ',IF(tnplm.amc_code = "FTI", '+
      'tnplm.product_code = R5.tp_nse_product_code, '+
      'CONCAT(tnplm.amc_code,tnplm.product_code) = R5.scheme_code '+
      ') ) '+
    ') R6 '+
    'ON '+
    'R6.asset_mutual_fund_sub_category_master_id = amfscm.asset_mutual_fund_sub_category_master_id '+
    ') R7 '+
    'ON '+
    'R7.asset_mutual_fund_category_master_id = amfcm.asset_mutual_fund_category_master_id '

  }
  
  // console.log('***query: ',query)
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.getShortlistedSchemes = function(obj,pm_query,plm_query) {
  var deferred = Q.defer();
  var query = 

  'SELECT TF.*,TF0.asset_mutual_fund_category_name FROM '+
    '(SELECT TM1.*,TM2.asset_mutual_fund_category_master_id,TM2.asset_mutual_fund_sub_category_name FROM '+
      '(SELECT T01.*,T02.* FROM '+
        '(SELECT '+
          'T1.tp_nse_product_master_id,T1.goal_based_term,T1.tp_nse_shortlisted_schemes_id,T1.scheme_added_on,T1.systematic_frequencies,T1.purchase_allowed,T1.switch_allowed,T1.redemption_allowed,T1.sip_allowed,T1.stp_allowed,T1.swp_allowed,T1.sip_dates,T1.swp_dates,T1.stp_dates,T1.product_category,T1.reinvest_tag,T1.isin,T1.active_flag,T1.asset_class,T1.sub_fund_code,T1.plan_type,T1.insurance_enabled,T1.rta_code, '+
          'T2.* FROM '+
          '( '+
          'SELECT tnpm.*,tnss.tp_nse_shortlisted_schemes_id,tnss.goal_based_term,tnss.scheme_added_on FROM tp_nse_product_master tnpm '+
          'INNER JOIN tp_nse_shortlisted_schemes tnss ON tnpm.amc_code = tnss.amc_code AND tnpm.product_code = tnss.product_code '+
          'AND admin_advisor_id = '+obj.admin_advisor_id+' '+
          pm_query+
          ') T1 '+
        'INNER JOIN '+
        'tp_nse_product_limit_master T2 '+
        'ON '+
        plm_query+
        'CONCAT(T1.amc_code,T1.product_code) = CONCAT(T2.amc_code,T2.product_code) ) T01 '+
      'LEFT JOIN '+
      'asset_mutual_fund_master T02 '+
      'ON '+
        'IF(FIND_IN_SET(T01.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
        ',IF(length(CONCAT(T01.amc_code,T01.product_code))=7 '+
          ',CONCAT(T01.amc_code,T01.product_code) = T02.scheme_code '+
          ',IF(length(CONCAT(T01.amc_code,T01.product_code))>7, '+
            'IF(SUBSTRING(CONCAT(T01.amc_code,T01.product_code),1,8) = T02.scheme_code '+
              ',true '+
              ',IF(SUBSTRING(CONCAT(T01.amc_code,T01.product_code),1,7) = T02.scheme_code,true,false) '+
              ') '+
            ',CONCAT(T01.amc_code,T01.product_code) = T02.scheme_code) '+
          ') '+
        ',IF(T01.amc_code = "FTI", '+
          'T01.product_code = T02.tp_nse_product_code, '+
          'CONCAT(T01.amc_code,T01.product_code) = T02.scheme_code '+
          ') ) '+
      ') TM1 '+
    'LEFT JOIN '+
    'asset_mutual_fund_sub_category_master TM2 '+
    'ON TM1.asset_mutual_fund_sub_category_master_id = TM2.asset_mutual_fund_sub_category_master_id) TF '+
  'LEFT JOIN '+
  'asset_mutual_fund_category_master TF0 '+
  'ON TF.asset_mutual_fund_category_master_id = TF0.asset_mutual_fund_category_master_id '

  // console.log('***query',query)
  
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
// Database.prototype.getAllSchemes = function(obj) {
//   var deferred = Q.defer();
//   var query = 
//   'SELECT * from tp_nse_product_master T1 '+
//   'INNER JOIN ( '+
//   'SELECT * FROM tp_nse_product_limit_master WHERE amc_code '+
//   'IN '+
//   '(SELECT amc_code FROM tp_nse_empanelled_amc WHERE admin_advisor_id = '+(obj.admin_advisor_id || "")+') '+
//   ') T2 '+
//   'ON '+
//   'CONCAT(T1.amc_code,T1.product_code) = CONCAT(T2.amc_code,T2.product_code)'

//   console.log('* ',query)
//   this.connection.acquire(function(err, con) {
//     con.query(query, function(err, result) {
//       con.release();
//       deferred.resolve(result)
//     });
//   });
//   return deferred.promise;
// };
Database.prototype.insertShortlistScheme = function(obj) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    con.query('SELECT EXISTS (SELECT * FROM tp_nse_shortlisted_schemes WHERE admin_advisor_id=? AND amc_code=? AND product_code=?) AS result;',[obj.admin_advisor_id,obj.amc_code,obj.product_code],function(err, result){
      if(result[0].result==1){ // is exist
        console.log('already exist')
        con.release();
        deferred.resolve({success:true,msg:"already exist"})
      }else{ // non exist
        var _valuesData=[]
        _valuesData.push(_.values({
          "admin_advisor_id": obj.admin_advisor_id,
          "amc_code": obj.amc_code,
          "product_code": obj.product_code,
          "goal_based_term": obj.goal_based_term || null,
          "tp_nse_product_master_id": obj.tp_nse_product_master_id || null,
          "scheme_added_on": new Date(obj.scheme_added_on)
        }))
        
        con.query('INSERT INTO tp_nse_shortlisted_schemes (admin_advisor_id,amc_code,product_code,goal_based_term,tp_nse_product_master_id,scheme_added_on) VALUES ?', [_valuesData], function(err, result) {
          if (err) {
            console.log('tp_nse_shortlisted_schemes Insert ERROR.',err)
            con.release();
            deferred.resolve({success:false,error:err})
          } else {
            console.log('tp_nse_shortlisted_schemes ',result)
            var query = 
            'SELECT * '+
            'FROM asset_mutual_fund_category_master AS AMFCM '+
            'RIGHT JOIN asset_mutual_fund_sub_category_master AS AMFSCM '+
              'ON '+
              'AMFCM.asset_mutual_fund_category_master_id = AMFSCM.asset_mutual_fund_category_master_id '+
            'RIGHT JOIN asset_mutual_fund_master AS AMF '+
              'ON '+
              'AMFSCM.asset_mutual_fund_sub_category_master_id = AMF.asset_mutual_fund_sub_category_master_id '+
            'WHERE '+
              'AMF.scheme_code = CONCAT("'+obj.amc_code+obj.product_code+'")';

            con.query(query,function(err,getResult){
              con.release();
              if(err){
                console.log('getResult ERROR.',err)
                deferred.resolve({success:false,error:err})
              }else{
                deferred.resolve({success:true,id:result.insertId,data:getResult})
              }
            })

          }
      });
      }
    })  
  });
  return deferred.promise;
};
Database.prototype.deleteShortlistScheme = function(obj) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    con.query('DELETE FROM tp_nse_shortlisted_schemes WHERE tp_nse_shortlisted_schemes_id=?', [obj.tp_nse_shortlisted_schemes_id], function(err, result) {
      con.release();
      if (err) {
        console.log('tp_nse_shortlisted_schemes Delete ERROR.')
        deferred.resolve({success:false,error:err})
      } else {
        console.log('tp_nse_shortlisted_schemes ',result)
        deferred.resolve({success:true,data:result})
      }
    })
  });
  return deferred.promise;
};
Database.prototype.getGoalMapping = function(obj) {
  var deferred = Q.defer(); 
  var whereQuery = (obj.goal_id)? 'goal_id = '+obj.goal_id : 'client_id = '+obj.client_id;
  var query = 
  'SELECT TF.*,TF0.asset_mutual_fund_category_name FROM '+
  '(SELECT TM1.*,TM2.asset_mutual_fund_category_master_id,TM2.asset_mutual_fund_sub_category_name FROM '+
    '(SELECT T01.*,T02.* FROM '+
      '(SELECT '+
        'T1.tp_nse_product_master_id,T1.systematic_frequencies,T1.purchase_allowed,T1.switch_allowed,T1.redemption_allowed,T1.sip_allowed,T1.stp_allowed,T1.swp_allowed,T1.sip_dates,T1.swp_dates,T1.stp_dates,T1.product_category,T1.reinvest_tag,T1.isin, '+
        'T1.tp_nse_mf_goal_mapping_id,T1.client_id,T1.goal_id,T1.asset_id,T1.is_transaction_initiated,T1.transaction_initiated_type,T1.folio_number,T1.family_member_id,T1.transaction_date,T1.transaction_amount,T1.breakup,T1.sip_selected_date,T1.sip_selected_frequency,T1.tagged,T1.created_at, '+
        'T2.* FROM '+
        '( '+
        'SELECT tnpm.*,T0.tp_nse_mf_goal_mapping_id,T0.client_id,T0.goal_id,T0.asset_id,T0.is_transaction_initiated,T0.transaction_initiated_type,T0.folio_number,T0.family_member_id,T0.transaction_date,T0.transaction_amount,T0.breakup,T0.sip_selected_date,T0.sip_selected_frequency,T0.tagged,T0.created_at FROM tp_nse_product_master tnpm '+
        'INNER JOIN '+
          '( SELECT * FROM tp_nse_mf_goal_mapping tnmgm WHERE '+whereQuery+' GROUP BY amc_code,product_code,transaction_amount,transaction_initiated_type ORDER BY created_at DESC limit 10 '+
          ') T0 '+
        'ON (tnpm.amc_code = T0.amc_code AND tnpm.product_code = T0.product_code) '+
        ') T1 '+
      'INNER JOIN '+
      'tp_nse_product_limit_master T2 '+
      'ON '+
      'CONCAT(T1.amc_code,T1.product_code) = CONCAT(T2.amc_code,T2.product_code) ) T01 '+
    'LEFT JOIN '+
    'asset_mutual_fund_master T02 '+
    'ON '+
      'IF(FIND_IN_SET(T01.amc_code,"101,102,103,107,108,116,117,118,120,123,127,128,129,135,PLF,RMF")>0 '+
      ',IF(length(CONCAT(T01.amc_code,T01.product_code))=7 '+
        ',CONCAT(T01.amc_code,T01.product_code) = T02.scheme_code '+
        ',IF(length(CONCAT(T01.amc_code,T01.product_code))>7, '+
          'IF(SUBSTRING(CONCAT(T01.amc_code,T01.product_code),1,8) = T02.scheme_code '+
            ',true '+
            ',IF(SUBSTRING(CONCAT(T01.amc_code,T01.product_code),1,7) = T02.scheme_code,true,false) '+
            ') '+
          ',CONCAT(T01.amc_code,T01.product_code) = T02.scheme_code) '+
        ') '+
      ',CONCAT(T01.amc_code,T01.product_code) = T02.scheme_code) '+
    ') TM1 '+
  'LEFT JOIN '+
  'asset_mutual_fund_sub_category_master TM2 '+
  'ON TM1.asset_mutual_fund_sub_category_master_id = TM2.asset_mutual_fund_sub_category_master_id) TF '+
  'LEFT JOIN '+
  'asset_mutual_fund_category_master TF0 '+
  'ON TF.asset_mutual_fund_category_master_id = TF0.asset_mutual_fund_category_master_id '

  // console.log('query***',query)
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};
Database.prototype.mapGoalTransaction = function(obj) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    var _valuesData=_.values({
      "client_id":obj.client_id,
      "goal_id":obj.goal_id,
      "asset_id":obj.asset_id || null,
      "folio_number":obj.folio_number,
      "family_member_id":obj.family_member_id,
      "transaction_date":new Date(obj.transaction_date),
      "transaction_amount":obj.transaction_amount,
      "breakup":obj.breakup,
      "amc_code":obj.amc_code,
      "product_code":obj.product_code,
      "sip_selected_date":obj.sip_selected_date,
      "sip_selected_frequency":obj.sip_selected_frequency,
      "tagged":obj.tagged,
      "transaction_initiated_type":obj.transaction_initiated_type,
      "is_transaction_initiated":obj.is_transaction_initiated || 0,
      "created_at":new Date()
    })
    var existCheckQuery='',existCheckQueryParams=[]
    if(obj.asset_id==null || obj.asset_id==""){
      existCheckQuery='SELECT tp_nse_mf_goal_mapping_id FROM tp_nse_mf_goal_mapping WHERE goal_id=? AND asset_id IS NULL AND amc_code=? AND product_code=? AND transaction_initiated_type=? '
      existCheckQueryParams=[obj.goal_id,obj.amc_code,obj.product_code,obj.transaction_initiated_type]
    }else{
      existCheckQuery='SELECT tp_nse_mf_goal_mapping_id FROM tp_nse_mf_goal_mapping WHERE goal_id=? AND asset_id=? AND amc_code=? AND product_code=? AND transaction_initiated_type=? '
      existCheckQueryParams=[obj.goal_id,obj.asset_id,obj.amc_code,obj.product_code,obj.transaction_initiated_type]
    }
    // if(obj.transaction_initiated_type==null || obj.transaction_initiated_type==""){
    //   existCheckQuery+='AND transaction_initiated_type IS NULL'
    // }else{
    //   existCheckQuery+='AND transaction_initiated_type=?'
    //   existCheckQueryParams.push(obj.transaction_initiated_type)
    // }    

    con.query(existCheckQuery,existCheckQueryParams,function(err, result){
      if(typeof result[0] != "undefined"){ // is exist
        _valuesData.push(result[0].tp_nse_mf_goal_mapping_id)
        console.log('already exist')
        con.query('UPDATE tp_nse_mf_goal_mapping SET client_id=?,goal_id=?,asset_id=?,folio_number=?,family_member_id=?,transaction_date=?,transaction_amount=?,breakup=?,amc_code=?,product_code=?,sip_selected_date=?,sip_selected_frequency=?,tagged=?,transaction_initiated_type=?,is_transaction_initiated=?,created_at=? WHERE tp_nse_mf_goal_mapping_id=?', _valuesData, function(err, result) {
          if (err) { 
            console.log('tp_nse_mf_goal_mapping Update ERROR.',err)
            deferred.resolve({success:false,update:false,error:err})
          } else {
            console.log('tp_nse_mf_goal_mapping Update ',result)
            deferred.resolve({success:true,update:true,id:_.last(_valuesData)})
          }
        });
      }else{ // non exist
        con.query('INSERT INTO tp_nse_mf_goal_mapping (client_id,goal_id,asset_id,folio_number,family_member_id,transaction_date,transaction_amount,breakup,amc_code,product_code,sip_selected_date,sip_selected_frequency,tagged,transaction_initiated_type,is_transaction_initiated,created_at) VALUES ?', [[_valuesData]], function(err, result) {
          if (err) {
            console.log('tp_nse_mf_goal_mapping Insert ERROR.',err)
            deferred.resolve({success:false,error:err})
          } else {
            console.log('tp_nse_mf_goal_mapping Insert',result)
            deferred.resolve({success:true,id:result.insertId})
          }
        });
      }
    })  
  });
  return deferred.promise;
};
Database.prototype.deleteGoalTransaction = function(obj) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    con.query('DELETE FROM tp_nse_mf_goal_mapping WHERE tp_nse_mf_goal_mapping_id=?', [obj.tp_nse_mf_goal_mapping_id], function(err, result) {
      con.release();
      if (err) {
        console.log('tp_nse_mf_goal_mapping Delete ERROR.')
        deferred.resolve({success:false,error:err})
      } else {
        console.log('tp_nse_mf_goal_mapping ',result)
        deferred.resolve({success:true,data:result})
      }
    })
  });
  return deferred.promise;
};

/* ----------------- TRANSACTION ----------------- */
Database.prototype.insertTransaction = function(obj,postData) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
  
    var _result = []
    console.log('obj.service_response : ',obj.service_response)
    var transactions = (Object.prototype.toString.call(obj.service_response) === '[object Array]')?
        obj.service_response : [obj.service_response];
    forEach(transactions,function(transaction){
      var done = this.async()
      var _valuesData=[]
      var link = (typeof transaction.Paymentlink!="undefined")?
        transaction.Paymentlink.match(/http([^\'\"]+)/) : [""]; // pull payment link from junk
      _valuesData.push(_.values({
        "unique_no": transaction.Unique_No || "",
        "trxn_no": transaction.Trxn_No || "",
        "fund": transaction.Fund || "",
        "folio": transaction.Folio || "",
        "scheme": transaction.Scheme || "",
        "scheme_name": transaction.Scheme_Name || "",
        "amt": transaction.Amt || "",
        "amt_unit_type": transaction.Amt_Unit_Type || "",
        "status_desc": transaction.Status_Desc || "",
        "paymentlink": link[0] || "",
        "service_return_code": obj.service_status.service_return_code || "",
        "service_msg": obj.service_status.service_msg || "",

        "return_msg": transaction.return_msg || "",
        "source_product": transaction.Source_Scheme || "",
        "target_product": transaction.Target_Scheme || "",
        "source_product_name": transaction.Source_Scheme_Name || "",
        "target_product_name": transaction.Target_Scheme_Name || "",

        "admin_advisor_id":postData.extras.admin_advisor_id || null,
        "client_id":postData.extras.client_id || null,
        "trxn_type": postData.extras.trxn_type || null, // for Purchase
        "sub_trxn_type":postData.extras.systematic_sub_trxn_type || "",
        "family_member_id":postData.extras.family_member_id || null,
        "iin": postData.data.iin,

        "order_date": new Date(), // present date
        "last_updated_on": new Date() // present date
      }))

      con.query('INSERT INTO tp_nse_transactions (unique_no,trxn_no,fund,folio,scheme,scheme_name,amt,amt_unit_type,status_desc,paymentlink,service_return_code,service_msg,return_msg,source_product,target_product,source_product_name,target_product_name,admin_advisor_id,client_id,trxn_type,sub_trxn_type,family_member_id,iin,order_date,last_updated_on) VALUES ?', [_valuesData], function(err, result) {
        if(err){
          console.log('tp_nse_transactions Insert ERROR.',err)
          _result.push({success:false,error:err})
        }else{
          console.log('tp_nse_transactions ',result)
          _result.push({success:true,id:result.insertId})
        }
        done()
      });
    },function(){ // alldone
      con.release();
      console.log('all transactions processed successfully')
      deferred.resolve(_result)
    })

  });
  return deferred.promise;
};
Database.prototype.updateTransaction = function(obj,last_update_datetime) {
  var deferred = Q.defer();
  this.connection.acquire(function(err, con) {
    if(Object.prototype.toString.call(obj) === '[object Array]'){
      forEach(obj,function(row){
        var done = this.async()
        con.query('UPDATE tp_nse_transactions SET service_msg=?, last_updated_on=? WHERE trxn_no=? AND unique_no=? AND iin=?', [row.TRXN_STATUS,last_update_datetime,row.REF_NO,row.PAYMENT_REF_NO,row.INVESTOR_IIN], function(err, result) {
          if (err) {
            console.log('tp_nse_transactions Update ERROR.',err)
          }
          done()
        });
      },function(){ // alldone
        con.release();
        console.log('all transactions upadted successfully')
        deferred.resolve({success:true})
      })
    }else{
      con.query('UPDATE tp_nse_transactions SET service_msg=?, last_updated_on=? WHERE trxn_no=? AND unique_no=? AND iin=?', [obj.TRXN_STATUS,last_update_datetime,obj.REF_NO,obj.PAYMENT_REF_NO,obj.INVESTOR_IIN], function(err, result) {
        con.release();
        if (err) {
          console.log('tp_nse_transactions Update ERROR.',err)
          deferred.resolve({success:false,error:err})
        } else {
          console.log('transaction upadted successfully')
          deferred.resolve({success:true})
        }
      });
    }
  });
  return deferred.promise;
};
Database.prototype.getTransactions = function(obj) {
  var deferred = Q.defer();
  var query = '';
  if(obj.admin_advisor_id){
    var list=[obj.teamMemberSessionId].concat(_.map(obj.teamHierarchyList,o=>{return o.teamMemberId}))
    query = 
    'SELECT tnt.*,fm.full_name FROM tp_nse_transactions tnt '+
    'INNER JOIN family_members fm '+
    'ON '+
    'tnt.family_member_id=fm.family_member_id '+
    'LEFT JOIN clients c '+
    'ON '+
    'fm.client_id =  c.client_id WHERE c.team_member_session_id IN ('+list+') AND tnt.admin_advisor_id='+(obj.admin_advisor_id)
  }else{
    query = 
    'SELECT tnt.*,fm.full_name FROM tp_nse_transactions tnt '+
    'INNER JOIN family_members fm '+
    'ON '+
    'tnt.client_id='+(obj.client_id)+' AND tnt.family_member_id=fm.family_member_id'
  }
  
  this.connection.acquire(function(err, con) {
    con.query(query, function(err, result) {
      con.release();
      deferred.resolve(result)
    });
  });
  return deferred.promise;
};

module.exports = Database;