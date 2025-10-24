const Logger = require('../model/logger');

class LoggerController {
    async createLog(message, level) {
        if (message === undefined || level === undefined) {
            throw new Error('Mensagem e nível são obrigatórios');
        }

        const log = await Logger.create({
            message,
            level,
            timestamp: new Date()
        });

        return log;
    }

    async listLog() {
        const logs = await Logger.find();

        return logs;
    }
}

module.exports = new LoggerController();