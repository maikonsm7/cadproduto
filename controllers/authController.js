// const { raw } = require('mysql2')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')

class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }
    static async loginPost(req, res) {
        const { email, senha } = req.body
        const user = await Usuario.findOne({ where: { email } })

        if (!user) {
            req.flash('message', 'Usuário não cadastrado!')
            res.render('auth/login')
            return
        }

        const passwordMatch = bcrypt.compareSync(senha, user.senha)
        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')
            return
        }

        req.session.userid = user.id
        req.session.save(() => {
            res.redirect('/produtos')
        })


    }
    static register(req, res) {
        res.render('auth/register')
    }
    static async registerPost(req, res) {
        const { nome, email, senha, confirmesenha } = req.body

        // password match validation
        if (senha !== confirmesenha) {
            req.flash('message', 'As senhas não conferem!')
            res.render('auth/register')
            return
        }

        // check email if exists
        const checkIfUserExists = await Usuario.findOne({ where: { email } })
        if (checkIfUserExists) {
            req.flash('message', 'Email já cadastrado!')
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync(10) // adiciona 10 caracteres randomicos na senha
        const hashedPassword = bcrypt.hashSync(senha, salt)

        const user = {
            nome,
            email,
            senha: hashedPassword
        }

        try {
            const createdUser = await Usuario.create(user)

            // initialize session
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado!')

            req.session.save(() => {
                res.redirect('/produtos')
            })
        } catch (error) {
            console.error('Erro: ', error)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}

module.exports = AuthController