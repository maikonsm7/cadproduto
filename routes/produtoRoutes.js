const express = require('express')
const router = express.Router()

const produtoController = require('../controllers/produtoController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', checkAuth, produtoController.showProdutos)

module.exports = router