const sequelize = require("../dbConnector");
const Sequelize = require("sequelize");

module.exports = function(){

	var User = sequelize.define(`uzytkownicy`, 
	{
		id			: { type: Sequelize.dataTypes.INTEGER(10), notNull: true, primaryKey: true},
		login		: { type: Sequelize.dataTypes.STRING(45)},
		password	: { type: Sequelize.dataTypes.STRING(45)}
	},
	{
		freezeTableName: true,
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	});

	return User;
}