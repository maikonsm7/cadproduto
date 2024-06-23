const { raw } = require('mysql2')
const { Op } = require('sequelize') // operador de like (buscar itens com a palavra desejada)
const Produto = require('../models/Produto')
const Category = require('../models/Category')

class produtoController {
    static async showProdutos(req, res) {
        const UsuarioId = req.session.userid
        let search = ''
        let qtdSearch = ''
        let CategoryId = null
        if (req.query.search) {
            search = req.query.search
        }
        if(req.query.category){
            CategoryId = parseInt(req.query.category)
        }
        try {
            const [produtosData, categories] = await Promise.all([
                CategoryId ?
                Produto.findAll({ include: Category, where: { CategoryId, UsuarioId } }) :
                Produto.findAll({ include: Category, where: { nome: { [Op.like]: `%${search}%`}, UsuarioId } }),
                Category.findAll({raw: true, where: {UsuarioId}})
            ])
            const produtosUsuario = produtosData.map(prod => prod.get({ plain: true })) // pegar somente os valores das duas tabelas juntas

            let emptyProdutos = false
            if (produtosUsuario.length === 0 && search === '' && CategoryId === null) {
                emptyProdutos = true
            } else if (produtosUsuario.length >= 0 && search !== '' && CategoryId !== null) {
                qtdSearch = `${produtosUsuario.length} ${produtosUsuario.length > 1 ? 'resultados' : 'resultado'}`
            }
            res.render('produto/all', { produtosUsuario, emptyProdutos, qtdSearch, categories })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async createProduto(req, res) {
        const UsuarioId = req.session.userid
        try {
            const categories = await Category.findAll({ raw: true, where:{UsuarioId} })
            if (categories.length === 0) {
                req.flash('message', 'Adicione alguma categoria!')
                res.render('category/all')
            }else{
                res.render('produto/add', {categories})
            }
        } catch (error) {
            console.log('erro: ', error)
        }
    }
    static async createProdutoSave(req, res) {
        const produto = {
            nome: req.body.nome,
            preco: req.body.preco,
            qtd_estoque: req.body.estoque,
            qtd_vendas: 0,
            UsuarioId: req.session.userid,
            CategoryId: req.body.category
        }
        try {
            await Produto.create(produto)
            req.flash('message', 'Produto adicionado!')
            req.session.save(() => {
                res.redirect('/produtos')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async removeProduto(req, res) {
        const id = req.params.id
        const UsuarioId = req.session.userid

        try {
            await Produto.destroy({ where: { id, UsuarioId } })
            req.flash('message', 'Produto removido!')
            req.session.save(() => {
                res.redirect('/produtos')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async updateProduto(req, res) {
        const id = req.params.id
        const UsuarioId = req.session.userid
        try {
            const [produtoUsuario, cat] = await Promise.all([
                Produto.findOne({include: Category, where: { id, UsuarioId } }),
                Category.findAll({raw: true, where: {UsuarioId}})
            ])
            const produto = produtoUsuario.get({ plain: true })
            const categories = cat.filter(category => category.id !== produto.CategoryId)
            res.render('produto/edit', { produto, categories})
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async updateProdutoSave(req, res) {
        const id = req.body.id
        const UsuarioId = req.session.userid
        const produto = {
            nome: req.body.nome,
            preco: req.body.preco,
            qtd_estoque: req.body.estoque,
            CategoryId: req.body.category
        }
        try {
            await Produto.update(produto, { where: { id, UsuarioId } })
            req.flash('message', 'Produto atualizado!')
            req.session.save(() => {
                res.redirect('/produtos')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
}

module.exports = produtoController