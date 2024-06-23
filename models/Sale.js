const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Usuario = require('../models/Usuario')
const Produto = require('../models/Produto')

const Sale = db.define('Sale', {
    nome_cliente: {type: DataTypes.STRING, required: true},
    qtd_prod: {type: DataTypes.INTEGER, required: true}
})

Sale.belongsTo(Usuario)
Usuario.hasMany(Sale)

Sale.belongsTo(Produto)
Produto.hasMany(Sale)

module.exports = Sale

