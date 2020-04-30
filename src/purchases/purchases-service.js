
const PurchasesService = {
    getAllPurchases(db) {
        return db
        .from('justforfund_purchases')
        .select('*')
    },
    getById(db, id){
        return db
            .from('justforfund_purchases AS purchase')
            .select('*')
            .where('purchase.id', id)
            .first()
    },
    getAllByBudgetId(db, id){
        return db
            .from('justforfund_purchases')
            .select('*')
            .where('budget_id', id)
    },
    insertPurchase(db, newPurchase){
        return db
            .insert(newPurchase)
            .into('justforfund_purchases')
            .returning('*')
            .then(([purchase]) => purchase)
            .then(purchase =>
                PurchasesService.getById(db, purchase.id))
    }
}

module.exports = PurchasesService