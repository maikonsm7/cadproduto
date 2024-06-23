const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const Usuario = require('./Usuario')

const Category = db.define('Category', {
    descricao: {type: DataTypes.STRING, required: true}
})

Category.belongsTo(Usuario)
Usuario.hasMany(Category)

module.exports = Category