const database = require('../config/database');

class Logger {
    constructor() {
        this.model = database.db.define('logs', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            message: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            level: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            timestamp: {
                type: database.db.Sequelize.DATE,
                allowNull: false
            }
        });
    }
}

module.exports = (new Logger).model;