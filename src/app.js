require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('../src/users/users-router')
const purchasesRouter = require('../src/purchases/purchases-router')
const budgetsRouter = require('../src/budgets/budgets-router')
const authRouter = require('../src/auth/auth-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))


app.use(helmet())
app.use(cors())

app.use('/api/users', usersRouter)
app.use('/api/purchases', purchasesRouter)
app.use('/api/budgets', budgetsRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app