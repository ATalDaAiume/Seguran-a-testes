const Task = require('../model/task');
const loggerController = require('./logger');

class TaskController {
    async criarTarefa(titulo, descricao, userId) {
        if (
            titulo === undefined ||
            userId === undefined
        ) {
            loggerController.createLog('error', 'Título e userId são obrigatórios');
            throw new Error('Título e userId são obrigatórios');
        }

        const task = await Task.create({ titulo, descricao, userId: userId });
        loggerController.createLog('success', `Tarefa criada para o usuário ${userId}`);
        
        return task;
    }

    async buscarTarefaPorId(taskId, userId) {
        if (taskId === undefined || userId === undefined) {
            loggerController.createLog('error', 'Id da tarefa e Id do usuário são obrigatórios');
            throw new Error('Id da tarefa e Id do usuário são obrigatórios');
        }

        const task = await Task.findOne({ where: { id: taskId, userId: userId }});

        if (!task) {
            loggerController.createLog('error', 'Tarefa não encontrada ou não pertence ao usuário');
            throw new Error('Tarefa não encontrada ou não pertence ao usuário');
        }

        return task;
    }

    async listarTarefasDoUsuario(userId, status) {
        if (userId === undefined) {
            loggerController.createLog('error', 'Id do usuário é obrigatório');
            throw new Error('Id do usuário é obrigatório');
        }

        const whereClause = { userId: userId };
        if (status) {
            whereClause.status = status;
        }

        loggerController.createLog('success', `Listando tarefas para o usuário ${userId}`);
        return Task.findAll({ where: whereClause });
    }

    async alterarTarefa(taskId, userId, updates) {
        if (
            taskId === undefined ||
            userId === undefined ||
            updates === undefined
        ) {
            loggerController.createLog('error', 'Id da tarefa, Id do usuário e dados são obrigatórios');
            throw new Error('Id da tarefa, Id do usuário e dados são obrigatórios');
        }

        const task = await this.buscarTarefaPorId(taskId, userId);

        const { titulo, descricao, status } = updates;

        task.titulo = titulo !== undefined ? titulo : task.titulo;
        task.descricao = descricao !== undefined ? descricao : task.descricao;
        task.status = status !== undefined ? status : task.status;

        await task.save();
        loggerController.createLog('success', `Tarefa ${taskId} atualizada pelo usuário ${userId}`);
        
        return task;
    }

    async deletarTarefa(taskId, userId) {
        if (taskId === undefined || userId === undefined) {
            loggerController.createLog('error', 'Id da tarefa e Id do usuário são obrigatórios');
            throw new Error('Id da tarefa e Id do usuário são obrigatórios');
        }

        const task = await this.buscarTarefaPorId(taskId, userId);

        await task.destroy();
        loggerController.createLog('success', `Tarefa ${taskId} deletada pelo usuário ${userId}`);
    }
}

module.exports = new TaskController();