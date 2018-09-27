module.exports=function(Sequelize,sequelize){
	var model={}
	model=sequelize.define('candidates', {
		candidates_id:{
	    type: Sequelize.INTEGER(11),
	    allowNull: false,
	    primaryKey: true,
	  },
	  user_id:{
	  	type: Sequelize.INTEGER(11),
	    allowNull: false
	  },
	  is_arranged:Sequelize.BOOLEAN,
	  arranged_with:Sequelize.INTEGER(20),
	});
	return model;
}

