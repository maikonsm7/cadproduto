const express = require('express')
const router = express.Router()

const produtoController = require('../controllers/produtoController')
// helpers
// middleware que checa se o usuário está logado
// se estiver logado, prossiga
// se não, redireciona para o login
const checkAuth = require('../helpers/auth').checkAuth



router.get('/', checkAuth, produtoController.showProdutos)
router.get('/add', checkAuth, produtoController.createProduto)
router.post('/add', checkAuth, produtoController.createProdutoSave)
router.get('/remove/:id', checkAuth, produtoController.removeProduto)
router.get('/edit/:id', checkAuth, produtoController.updateProduto)
router.post('/edit', checkAuth, produtoController.updateProdutoSave)

module.exports = router