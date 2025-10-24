const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const userApi = require('../controller/user');

router.post('/', userApi.criarUsuario);
router.post('/login', userApi.login);

router.use(authMiddleware);

router.get('/', userApi.listarUsuario);
router.put('/:id', userApi.alterarUsuario);
router.delete('/:id', userApi.deletarUsuario);

module.exports = router;