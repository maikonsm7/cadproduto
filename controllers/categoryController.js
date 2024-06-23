const {raw} = require('mysql2')
const Category = require('../models/Category')

class categoryController{
    static async showCategories(req, res){
        const UsuarioId = req.session.userid
        try {
            const categoriesData = await Category.findAll({where: {UsuarioId}}) // traz os dados do usuário junto, se tiver algo na pesquisa, ele busca só os itens filtrados
            const categoriesUsuario = categoriesData.map(prod => prod.get({plain: true})) // pegar somente os valores
           
            let emptyCategories = false    
            if(categoriesUsuario.length === 0){
                emptyCategories = true
            }
            res.render('category/all', {categoriesUsuario, emptyCategories})
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static createCategory(req, res){
        res.render('category/add')
    }
    static async createCategorySave(req, res){
        const category = {
            descricao: req.body.descricao,
            UsuarioId: req.session.userid
        }
        try {
            await Category.create(category)
            req.flash('message', 'Categoria adicionada!')
            req.session.save(()=>{
                res.redirect('/categories')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async removeCategory(req, res){
        const id = req.params.id
        const UsuarioId = req.session.userid
        
        try{
            await Category.destroy({where: {id, UsuarioId}})
            req.flash('message', 'Categoria removida!')
            req.session.save(()=>{
                res.redirect('/categories')
            })
        }catch(error){
            console.error('Erro: ', error)
        }
    }
    static async updateCategory(req, res){
        const id = req.params.id
        const UsuarioId = req.session.userid
        try {
            const category = await Category.findOne({raw: true, where: {id, UsuarioId}})
            res.render('category/edit', {category})
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
    static async updateCategorySave(req, res){
        const id = req.body.id
        const category = {
            descricao: req.body.descricao,
            UsuarioId: req.session.userid
        }
        try {
            await Category.update(category, {where: {id, UsuarioId}})
            req.flash('message', 'Categoria atualizada!')
            req.session.save(()=>{
                res.redirect('/categories')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }
}

module.exports = categoryController