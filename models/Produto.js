const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const Usuario = require('./Usuario')
const Category = require('./Category')

const Produto = db.define('Produto', {
    nome: {type: DataTypes.STRING, required: true},
    preco: {type: DataTypes.FLOAT, required: true},
    qtd_estoque: {type: DataTypes.INTEGER, required: true}
})

Produto.belongsTo(Usuario)
Usuario.hasMany(Produto)

Produto.belongsTo(Category)
Category.hasMany(Produto)

module.exports = Produto