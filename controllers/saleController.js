const {raw} = require('mysql2')
const Sale = require('../models/Sale')
const Produto = require('../models/Produto')
const { Op } = require('sequelize')

class saleController{
    static async showSales(req, res){
        const UsuarioId = req.session.userid
        try {
            let emptySales = true
            const salesData = await Sale.findAll({include: Produto, where: {UsuarioId}})
            const salesUsuario = salesData.map(sale => sale.get({plain: true}))
            if(salesUsuario.length > 0){    
                emptySales = false
            }
            res.render('sale/all', {salesUsuario, emptySales})
        } catch (error) {
            console.error('erro: ', error)
        }
    }
    static async createSale(req, res){
        const UsuarioId = req.session.userid
        try {
            const produtos = await Produto.findAll({raw: true, where:{UsuarioId, qtd_estoque: {[Op.gt]: 0}}})
            if (produtos.length === 0) {
                req.flash('message', 'Adicione um produto!')
                res.render('produto/all')
            }else{
                res.render('sale/add', {produtos})
            }
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async createSaleSave(req, res){
        const UsuarioId = req.session.userid
        const sale = {
            nome_cliente: req.body.nome_cliente,
            qtd_prod: req.body.qtd_prod,
            UsuarioId,
            ProdutoId: req.body.produto
        }
        try {
            const produto = await Produto.findOne({raw: true, where: {id: sale.ProdutoId, UsuarioId}})
            if(req.body.qtd_prod > produto.qtd_estoque){
                req.flash('message', `Há apenas ${produto.qtd_estoque} unidades no estoque`)
                req.session.save(() => {
                    res.redirect('/sales/add')
                })
            }else{
                produto.qtd_vendas = produto.qtd_vendas + parseInt(req.body.qtd_prod)
                produto.qtd_estoque = produto.qtd_estoque - parseInt(req.body.qtd_prod)
                await Promise.all([
                    Sale.create(sale),
                    Produto.update(produto, {where: {id: sale.ProdutoId, UsuarioId}})
                ])
                req.flash('message', 'Venda realizada!')
                req.session.save(() => {
                    res.redirect('/sales')
                })
            }

        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async removeSale(req, res) {
        const id = req.params.id
        const UsuarioId = req.session.userid

        try {
            await Sale.destroy({ where: { id, UsuarioId } })
            req.flash('message', 'Venda removida!')
            req.session.save(() => {
                res.redirect('/sales')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
}

module.exports = saleController