const userController = require('../services/user');

class UserApi {
    async criarUsuario(req, res) {
        const nome = req.body.nome
        const email = req.body.email;
        const senha = req.body.senha;

        try {
            const user = await userController.criarUsuario(nome, email, senha);
            return res.status(201).send(user);
        } catch (error) {
            return res.status(400).send({ error: error.message })
        }
    }

    async alterarUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, senha } = req.body;
        // Obter o ID do usuário logado a partir do token (definido pelo authMiddleware)
        const userIdLogado = req.user.id; 

        try {
            // CORREÇÃO CRÍTICA (IDOR): Verificar se o usuário está alterando APENAS o seu próprio perfil.
            if (Number(id) !== userIdLogado) {
                return res.status(403).send({ error: 'Não autorizado a alterar este usuário. Você só pode alterar seu próprio perfil.' });
            }

            const user = await userController.alterarUsuario(Number(id), nome, email, senha);
            return res.status(200).send(user);
        } catch (error) {
            return res.status(400).send({ error: error.message })
        }
    }

    async deletarUsuario(req, res) {
        const { id } = req.params;
        // Obter o ID do usuário logado a partir do token (definido pelo authMiddleware)
        const userIdLogado = req.user.id; 

        try {
            // CORREÇÃO CRÍTICA (IDOR): Verificar se o usuário está deletando APENAS o seu próprio perfil.
            if (Number(id) !== userIdLogado) {
                return res.status(403).send({ error: 'Não autorizado a deletar este usuário. Você só pode deletar seu próprio perfil.' });
            }

            await userController.deletarUsuario(Number(id));
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send({ error: error.message })
        }
    }

    async listarUsuario(req, res) {
        try {
            const users = await userController.listarUsuarios();
            return res.status(200).send(users);
        } catch (error) {
            return res.status(400).send({ error: error.message })
        }
    }

    // Método para login
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const token = await userController.login(email, senha);
            return res.status(200).send(token);
        } catch (error) {
            return res.status(400).send({ error: error.message })
        }
    }

    // Método para validar o token
    async validarToken(req, res, next) {
        const token = req.headers.authorization;

        try {
            const payload = await userController.validarToken(token);
            req.user = payload;
            next();
        } catch (error) {
            return res.status(400).send({ error: error.message })
        }
    }
}

module.exports = new UserApi(); 