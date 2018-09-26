// ----------------------------------------------------------------------
// var Sequelize = require('sequelize');
// var sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
//     host: config.db.host,
//     port: 3306,
//     dialect: 'mysql',
//     pool: {
// 	    max: 100,
// 	    idle: 30000,
// 	    acquire: 60000,
// 	  },
// 	  define:{
// 			freezeTableName:true,
// 			timestamps: false
// 		}
// });
// //Checking connection status
// sequelize.authenticate().then(function (err) {
//  if (err) {
//     console.log('There is connection in ERROR');
//  } else {
//     console.log('Sequelize Connection has been established successfully');
//  }
// });


// var RoleMaster = require('./RoleMaster.js')(Sequelize,sequelize);
// var Users = require('./Users.js')(Sequelize,sequelize) ;
// 		// Candidates = require('./Candidates.js') ,
// 		// Credentials = require('./Credentials.js') ,
// 		// PersonalDetails = require('./PersonalDetails.js') ,
// 		// ProfessionalDetails = require('./ProfessionalDetails.js') ,
// 		// AstroDetails = require('./AstroDetails.js') ,
// 		// FamilyBackground = require('./FamilyBackground.js') ,
// 		// Contact = require('./Contact.js') ,
// 		// SocialContact = require('./SocialContact.js') ,
// 		// Telephone = require('./Telephone.js') ,
// 		// Images = require('./Images.js') ,

// /* Relations */
// Users.belongsTo(RoleMaster)

// ----------------------------------------------------------------------
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database,
    charset  : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

var RoleMaster = bookshelf.Model.extend({
  tableName: 'role_master',
  user: function(){
    return this.belongsTo(Users, 'user_id');
  }
})
var Users = bookshelf.Model.extend({
  tableName: 'users',
  role: function() {
    return this.hasOne(RoleMaster,'role_id');
  }
})


Users.fetchAll({withRelated: ['role']}).then(function(users) {
  console.log(users.toJSON());
}).catch(function(err) {
  console.error(err);
});

// ----------------------------------------------------------------------
module.exports = {

	RoleMaster : RoleMaster,
	// Users : Users,
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