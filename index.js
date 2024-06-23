const express = require('express')
require('dotenv').config()
const conn = require('./db/conn')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3001

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))

// engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// model
const Usuario = require('./models/Usuario')
const Category = require('./models/Category')
const Produto = require('./models/Produto')

// routes
const produtoRoutes = require('./routes/produtoRoutes')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const saleRoutes = require('./routes/saleRoutes')
const dashRoutes = require('./routes/dashRoutes')

const authController = require('./controllers/authController')

// session middleware
app.use(session({
    name: 'session',
    secret: process.env.SECRET || 'nosso_secret', //
    resave: false, // caiu a sessão.. ele desconecta
    saveUninitialized: false,
    store: new FileStore({
        logFn: function(){},
        path: require('path').join(require('os').tmpdir(), 'session')
    }),
    cookie: {
        secure: false,
        maxAge: 360000, // 1 dia
        httpOnly: true
    }
}))

app.use(flash())

app.use((req, res, next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

app.use('/produtos', produtoRoutes)
app.use('/categories', categoryRoutes)
app.use('/sales', saleRoutes)
app.use('/dashboard', dashRoutes)
app.use('/', authRoutes)
app.get('/', authController.login)

conn
// .sync({force: true})
.sync()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`servidor online. http://${host}:${port}`)
    })
})
.catch(error => console.log('erro: ', error))