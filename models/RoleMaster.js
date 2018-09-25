module.exports=function(Sequelize,sequelize){
	var model={}
	model=sequelize.define('role_master', {
	  role_id: {
	    type: Sequelize.INTEGER(2),
	    allowNull: false,
	    primaryKey: true,
	  },
	  role_name:Sequelize.STRING(20),
	});
	return model;
}

