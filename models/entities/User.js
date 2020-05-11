const sequelize = require("../../dbConnector");
const Sequelize = require("sequelize");

module.exports = function(){

	var User = sequelize.dbConnection.define(`users`, 
	{
		id			: { type: Sequelize.INTEGER(10), notNull: true, primaryKey: true},
		login		: { type: Sequelize.STRING(45)},
		password	: { type: Sequelize.STRING(45)}
	},
	{
		freezeTableName: true,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	});

	return User;
}