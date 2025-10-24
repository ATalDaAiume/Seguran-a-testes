const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const taskApi = require('../controller/task');

router.use(authMiddleware);

router.post('/', taskApi.criarTarefa);
router.get('/', taskApi.listarTarefas);
router.put('/:id', taskApi.alterarTarefa);
router.delete('/:id', taskApi.deletarTarefa);

module.exports = router;
