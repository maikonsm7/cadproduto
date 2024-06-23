const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const Usuario = require('./Usuario')

const Produto = db.define('Produto', {
    nome: {type: DataTypes.STRING, required: true},
    preco: {type: DataTypes.FLOAT, required: true},
    qtd_estoque: {type: DataTypes.INTEGER, required: true}
})

Produto.belongsTo(Usuario)
Usuario.hasMany(Produto)

module.exports = Produto