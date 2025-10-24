const express = require('express');
const router = express.Router();

const userApi = require('../controller/user');
const taskApi = require('../controller/task');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Rotas relacionadas a usuários
 *   - name: Autenticação
 *     description: Rotas para login e autenticação
 *   - name: Tarefas
 *     description: Rotas para gerenciamento de tarefas
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Usuários]
 *     summary: Cria um novo usuário
 *     description: Rota pública para registrar um novo usuário. A senha será criptografada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/users', userApi.criarUsuario);

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica um usuário e retorna um token JWT
 *     description: Rota pública para login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, token JWT retornado
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', userApi.login);

// Middleware de autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Usuários]
 *     summary: Lista todos os usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.get('/users', userApi.listarUsuario);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Usuários]
 *     summary: Altera um usuário existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser alterado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário alterado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put('/users/:id', userApi.alterarUsuario);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Usuários]
 *     summary: Deleta um usuário existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser deletado
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso (sem conteúdo)
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete('/users/:id', userApi.deletarUsuario);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tarefas]
 *     summary: Cria uma nova tarefa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Estudar para prova
 *               descricao:
 *                 type: string
 *                 example: Revisar slides da aula
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/tasks', taskApi.criarTarefa);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tarefas]
 *     summary: Lista todas as tarefas do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.get('/tasks', taskApi.listarTarefas);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tarefas]
 *     summary: Altera uma tarefa existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa a ser alterada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pendente, em andamento, concluída]
 *     responses:
 *       200:
 *         description: Tarefa alterada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       401:
 *         description: Não autorizado
 */
router.put('/tasks/:id', taskApi.alterarTarefa);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tarefas]
 *     summary: Deleta uma tarefa existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa a ser deletada
 *     responses:
 *       204:
 *         description: Tarefa deletada com sucesso (sem conteúdo)
 *       404:
 *         description: Tarefa não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete('/tasks/:id', taskApi.deletarTarefa);

module.exports = router;
