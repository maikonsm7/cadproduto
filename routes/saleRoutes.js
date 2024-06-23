const express = require('express')
const router = express.Router()

const saleController = require('../controllers/saleController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', checkAuth, saleController.showSales)
router.get('/add', checkAuth, saleController.createSale)
router.post('/add', checkAuth, saleController.createSaleSave)
router.get('/remove/:id', checkAuth, saleController.removeSale)

module.exports = router