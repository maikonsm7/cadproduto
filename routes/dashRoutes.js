const express = require('express')
const router = express.Router()

const dashController = require('../controllers/dashController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', checkAuth, dashController.showDash)

module.exports = router