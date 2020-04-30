const express = require('express')
const PurchasesService = require('./purchases-service')
const xss = require('xss')
const { requireAuth } = require('../middleware/jwt-auth')

const purchasesRouter = express.Router()
const jsonBodyParser = express.json()

const serializePurchase = purchase => ({
    id: purchase.id,
    date: xss(purchase.date),
    amount: xss(purchase.amount),
    category: xss(purchase.category),
    user_id: purchase.user_id,
    budget_id: purchase.budget_id
})

purchasesRouter
    .route('/')
    .get((req, res, next) => {
        PurchasesService.getAllPurchases(req.app.get('db'))
            .then(purchases => {
                res.json(purchases)
            })
            .catch(next)
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const {date, amount, category, budget_id} = req.body
        const newPurchase = {date, amount, category, budget_id}

        for(const [key, value] of Object.entries(newPurchase))
            if(value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        
        newPurchase.user_id = req.user.id
        PurchasesService.insertPurchase(
            req.app.get('db'),
            newPurchase
        )
        .then(purchase => {
            res
                .status(201)
                .location(`api/purchases/`)
                .json(serializePurchase(purchase))
        })
        .catch(next)
    })
purchasesRouter
    .route('/budget/:budget_id')
    .get((req, res, next) => {
        PurchasesService.getAllByBudgetId(req.app.get('db'), req.params.budget_id)
        .then(purchases => {
            res.json(purchases)
        })
        .catch(next)
    })


module.exports = purchasesRouter