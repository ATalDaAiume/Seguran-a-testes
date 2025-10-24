const taskController = require('../services/task');

class TaskApi {
    async criarTarefa(req, res) {
        const titulo = req.body.titulo;
        const descricao = req.body.descricao;
        const userId = req.user.id; 

        try {
            const task = await taskController.criarTarefa(titulo, descricao, userId);
            return res.status(201).send(task);
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    }

    async alterarTarefa(req, res) {
        const { id } = req.params;
        const { titulo, descricao, status } = req.body;
        const userId = req.user.id;

        try {
            const task = await taskController.alterarTarefa(Number(id), userId, { titulo, descricao, status });
            return res.status(200).send(task);
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    }

    async deletarTarefa(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            await taskController.deletarTarefa(Number(id), userId);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    }

    async listarTarefas(req, res) {
        const userId = req.user.id;
        const { status } = req.query;

        try {
            const tasks = await taskController.listarTarefasDoUsuario(userId, status);
            return res.status(200).send(tasks);
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    }
}

module.exports = new TaskApi();