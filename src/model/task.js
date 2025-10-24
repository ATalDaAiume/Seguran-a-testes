const database = require('../config/database');
const User = require('./user');

class Task {
    constructor() {
        this.model = database.db.define('tasks', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            titulo: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            descricao: {
                type: database.db.Sequelize.TEXT
            },
            status: {
                type: database.db.Sequelize.ENUM('pendente', 'em andamento', 'concluída'),
                defaultValue: 'pendente',
                allowNull: false
            },
            userId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: User,
                    key: 'id'
                }
            }
        });
    }
}

module.exports = (new Task).model;