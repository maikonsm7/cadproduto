const express = require('express')
const router = express.Router()

const categoryController = require('../controllers/categoryController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', checkAuth, categoryController.showCategories)
router.get('/add', checkAuth, categoryController.createCategory)
router.post('/add', checkAuth, categoryController.createCategorySave)
router.get('/remove/:id', checkAuth, categoryController.removeCategory)
router.get('/edit/:id', checkAuth, categoryController.updateCategory)
router.post('/edit', checkAuth, categoryController.updateCategorySave)

module.exports = router