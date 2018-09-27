module.exports=function(Sequelize,sequelize){
	var model={}
	model=sequelize.define('credentials', {
	  user_id:{
	    type: Sequelize.INTEGER(11),
	    allowNull: false
	  },
	  password:{
	  	type: Sequelize.STRING(100),
	    allowNull: false
	  }
	});
	model.removeAttribute('id')
	return model;
}

