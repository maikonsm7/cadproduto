const Chart = require('chart.js')
const { raw } = require('mysql2')
const Produto = require('../models/Produto')
const Category = require('../models/Category')

class dashController {
    static async showDash(req, res) {
        const UsuarioId = req.session.userid
        try {
            const [produtos, categories] = await Promise.all([
                Produto.findAll({ raw: true, where: { UsuarioId } }),
                Category.findAll({ raw: true, where: { UsuarioId } })
            ])
            const labels = categories.map(cat => cat.descricao)
            const valores = []
            categories.forEach(cat => {
                const result = produtos.reduce((acumulador, atual) => atual.CategoryId === cat.id ? atual.qtd_vendas + acumulador : acumulador, 0)
                valores.push(result)
            })
            res.render('dash/dashboard', { labels, valores })

        } catch (error) {
            console.error('Erro: ', error)
        }

    }
}

module.exports = dashController