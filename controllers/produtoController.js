const {raw} = require('mysql2')
const {Op} = require('sequelize') // operador de like (buscar itens com a palavra desejada)
const Produto = require('../models/Produto')
const Usuario = require('../models/Usuario')

class produtoController {
    static async showProdutos(req, res){
        let search = ''
        let qtdSearch = ''
        if(req.query.search){
            search = req.query.search
        }
        try {
            const produtosData = await Produto.findAll({include: Usuario, where: {nome: {[Op.like]: `%${search}%`}}}) // traz os dados do usuário junto, se tiver algo na pesquisa, ele busca só os itens filtrados
            const produtosUsuario = produtosData.map(prod => prod.get({plain: true})) // pegar somente os valores das duas tabelas juntas
           
            let emptyProdutos = false    
            if(produtosUsuario.length === 0 && search === ''){
                emptyProdutos = true
            }else if(produtosUsuario.length >= 0 && search !== ''){
                qtdSearch = `${produtosUsuario.length} ${produtosUsuario.length > 1 ? 'resultados' : 'resultado'}`
            }
            res.render('produto/all', {produtosUsuario, emptyProdutos, qtdSearch})
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static createProduto(req, res){
        res.render('produto/add')
    }
    static async createProdutoSave(req, res){
        const produto = {
            nome: req.body.nome,
            preco: req.body.preco,
            qtd_estoque: req.body.estoque,
            UsuarioId: req.session.userid
        }
        try {
            await Produto.create(produto)
            req.flash('message', 'Produto adicionado!')
            req.session.save(()=>{
                res.redirect('/produtos')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async removeProduto(req, res){
        const id = req.params.id
        const UsuarioId = req.session.userid
        
        try{
            await Produto.destroy({where: {id, UsuarioId}})
            req.flash('message', 'Produto removido!')
            req.session.save(()=>{
                res.redirect('/produtos')
            })
        }catch(error){
            console.error('Erro: ', error)
        }
    }
    static async updateProduto(req, res){
        const id = req.params.id
        const UsuarioId = req.session.userid
        try {
            const produto = await Produto.findOne({raw: true, where: {id, UsuarioId}})
            res.render('produto/edit', {produto})
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async updateProdutoSave(req, res){
        const id = req.body.id
        const UsuarioId = req.session.userid
        const produto = {
            nome: req.body.nome,
            preco: req.body.preco,
            qtd_estoque: req.body.estoque
        }
        try {
            await Produto.update(produto, {where: {id, UsuarioId}})
            req.flash('message', 'Produto atualizado!')
            req.session.save(()=>{
                res.redirect('/produtos')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
}

module.exports = produtoController