const loggerController = require('./logger');

class LoggerApi {
    async listLog(req, res) {
        try {
            const logs = await loggerController.listLog();
            return res.status(200).send(logs);
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    }
}

module.exports = new LoggerApi();