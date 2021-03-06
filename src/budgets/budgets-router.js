const express = require('express')
const BudgetsService = require('./budgets-service')
const xss = require('xss')
const { requireAuth } = require('../middleware/jwt-auth')

const budgetsRouter = express.Router()
const jsonBodyParser = express.json()

const serializeBudget = budget => ({
    id: budget.id,
    budget_name: xss(budget.budget_name),
    budget_limit: xss(budget.budget_limit),
    purchase_total: budget.purchase_total || 0,
})

const serializeBudgets = budgets => {
    return budgets.map(serializeBudget)
}

budgetsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        BudgetsService.getAllBudgets(req.app.get('db'))
            .then(budgets => {
                res.json(serializeBudgets(budgets))
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { budget_name, budget_limit } = req.body
        const newBudget = { budget_name, budget_limit }
        for(const [key, value] of Object.entries(newBudget))
        if(value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        BudgetsService.insertBudget(
            req.app.get('db'),
            newBudget
        )
        .then(budget => {
            res
                .status(201)
                .location(`api/budgets/${budget.id}`)
                .json(serializeBudget(budget))
        })
    })

budgetsRouter
    .route('/user/')
    .all(requireAuth)
    .get((req, res, next) => {
        const user_id = req.user.id
        BudgetsService.getByUserId(req.app.get('db'), user_id)
        .then(budgets => {
            res.json(serializeBudgets(budgets))
        })
        .catch(next)
    })

budgetsRouter
    .route('/:budget_id')
    .all(requireAuth)
    .get((req, res, next) => {
        BudgetsService.getByBudgetId(req.app.get('db'), req.params.budget_id)
        .then(budget => {
            if(!budget){
                return res.status(404).json({
                    error: { message: `Budget doesn't exist` }
                })
            }
            res.json(budget)
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        BudgetsService.deleteBudget(
            req.app.get('db'),
            req.params.budget_id
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })


module.exports = budgetsRouter