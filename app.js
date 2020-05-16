const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const stylus = require('stylus')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const apiRouter = require('./api/rest')
const musicRouter = require('./routes/musiques')
const fileUpload = require('express-fileupload')
const app = express()
const mongoose = require('mongoose')
const monk = require('monk')
const db = monk('localhost:27017/musicalbox')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(stylus.middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    req.db = db
    next()
})

app.use(fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp'),
}))
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/api', apiRouter)
app.use('/musiques', musicRouter)

mongoose.connect('mongodb://localhost/enterprise', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})

const mdb = mongoose.connection

mdb.on('error', console.error.bind(console, 'connection error:'))
mdb.once('open', () => {
    console.log('Connection Mongoose ok !')
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
