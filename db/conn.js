const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, '', {
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Banco conectado!')
} catch (error) {
    console.error('Erro: ', error)
}

module.exports = sequelize