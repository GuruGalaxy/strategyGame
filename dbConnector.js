const Sequelize = require("sequelize");

module.exports = {
    // database configuration
    dbConnection: new Sequelize('groom', 'groom_db_user', 'Uizoqt8Viv25vM20', 
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
        pool: 
        {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define:
        {
            // ustawienia charset i collation wciąż nic nie dają, łączymy się z utf8 ponieważ tak skonfigurowaliśmy bazę danych
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            dialectOptions: {
                collate: 'utf8_general_ci'
            },
            timestamps: false
        }
    }
    )
}