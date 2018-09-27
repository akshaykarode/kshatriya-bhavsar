var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
   host: config.db.host,
   port: 3306,
   dialect: 'mysql',
   pool: {
	    max: 100,
	    idle: 30000,
	    acquire: 60000,
	  },
	  define:{
			freezeTableName:true,
			timestamps: false
		}
});
//Checking connection status
sequelize.authenticate().then(function (err) {
	if (err) {
  	console.log('There is connection in ERROR');
	} else {
	  console.log('Sequelize Connection has been established successfully');
	}
});


var RoleMaster = require('./RoleMaster.js')(Sequelize,sequelize) ;
var Users = require('./Users.js')(Sequelize,sequelize) ;

// ------------------Relations----------------------------
Users.belongsTo(RoleMaster, {foreignKey: 'role_id'})
// --------------------------------------------------------

module.exports = {

	RoleMaster : RoleMaster,
	Users : Users,
	// Candidates : Candidates,
	// Credentials : Credentials,
	// PersonalDetails : Personal,
	// ProfessionalDetails : Professional,
	// AstroDetails : Astro,
	// FamilyBackground : Family,
	// Contact : Contact,
	// SocialContact : Social,
	// Telephone : Telephone,
	// Images : Images,
	
}