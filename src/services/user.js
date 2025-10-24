const User = require('../model/user');
const loggerController = require('./logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET;

class UserController {
    async criarUsuario(nome, email, senha) {
        if (
            nome === undefined
            || email === undefined
            || senha === undefined
        ) {
            loggerController.createLog('error', 'Nome, email e senha são obrigatórios');
            throw new Error('Nome, email e senha são obrigatórios');
        }

        // Cria um hash da senha a partir do bcrypt com 10 rounds
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        // INSERT INTO users (nome, email, senha) VALUES (nome, email, senha);
        const user = await User
            .create({ nome, email, senha: senhaCriptografada });
        loggerController.createLog('success', 'Usuário criado com sucesso');

        return user;
    }

    async buscarPorId(id) {
        if (id === undefined) {
            loggerController.createLog('error', 'Id é obrigatório');
            throw new Error('Id é obrigatório');
        }

        const user = await User.findByPk(id);

        if (!user) {
            loggerController.createLog('error', 'Usuário não encontrado');
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    async alterarUsuario(id, nome, email, senha) {
        if (
            id === undefined
            || nome === undefined
            || email === undefined
            || senha === undefined
        ) {
            loggerController.createLog('error', 'Id, nome, email e senha são obrigatórios');
            throw new Error('Id, nome, email e senha são obrigatórios');
        }

        const user = await this.buscarPorId(id);

        user.nome = nome;
        user.email = email;
        // Cria um hash da senha a partir do bcrypt com 10 rounds
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        user.senha = senhaCriptografada;
        // UPDATE users SET nome = nome, email = email, senha = senha WHERE id = id;
        user.save();
        loggerController.createLog('success', 'Usuário alterado com sucesso');

        return user;
    }

    async deletarUsuario(id) {
        if (id === undefined) {
            loggerController.createLog('error', 'Id é obrigatório');
            throw new Error('Id é obrigatório');
        }

        const user = await this.buscarPorId(id);

        user.destroy();
        loggerController.createLog('success', 'Usuário deletado com sucesso');
    }

    async listarUsuarios() {
        loggerController.createLog('success', 'Listando usuários');
        return User.findAll();
    }

    async login(email, senha) {
        if (!email || !senha) {
            loggerController.createLog('error', 'Email e senha são obrigatórios');
            throw new Error('Email e senha são obrigatórios');
        }

        // SELECT * FROM users WHERE email = email;
        // Busca o usuário pelo email
        const user = await User.findOne({ where: { email }});

        if (!user) {
            loggerController.createLog('error', 'Usuário não encontrado');
            throw new Error('Usuário não encontrado');
        }

        // Compara a senha informada com a senha do usuário
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            loggerController.createLog('error', 'Senha inválida');
            throw new Error('Senha inválida');
        }

        // Gera o token a partir da assinatura com a chave secreta
        const jwtToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

        loggerController.createLog('success', 'Usuário logado com sucesso');

        return { token: jwtToken }
    }

    async validarToken(token) {
        try {
            // Verifica se o token é válido e retorna o payload
            const payload = jwt.verify(token, JWT_SECRET_KEY);
            return payload;
        } catch (error) {
            loggerController.createLog('error', 'Token inválido');
            throw new Error('Token inválido');
        }
    }
}

module.exports = new UserController();