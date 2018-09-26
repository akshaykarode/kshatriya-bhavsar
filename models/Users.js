module.exports=function(Sequelize,sequelize){
	var model={}
	model=sequelize.define('users', {
	  user_id:{
	    type: Sequelize.INTEGER(11),
	    allowNull: false,
	    primaryKey: true,
	  },
	  user_name:Sequelize.STRING(20),
	  email_id:Sequelize.STRING(20),
	  role_id:{
	  	type: Sequelize.INTEGER(11),
	    allowNull: false,
	    references: {
	      model: "role_master",
	      key: "role_id"
	    }
	  }
	});
	return model;
}

