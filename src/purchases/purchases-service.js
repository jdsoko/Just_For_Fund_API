
const PurchasesService = {
    getAllPurchases(db) {
        return db
        .from('justforfund_purchases as purchase')
        .select(
            'purchase.id',
            'purchase.date',
            'purchase.amount',
            'purchase.category',
            'purchase.budget_id',
            'user.full_name as name'
        )
        .join(
            'justforfund_users as user',
            'purchase.user_id',
            'user.id'
        )
        .orderBy('purchase.date', 'desc')
    },
    getById(db, id){
        return db
            .from('justforfund_purchases AS purchase')
            .select(
                'purchase.id',
                'purchase.date',
                'purchase.amount',
                'purchase.category',
                'purchase.budget_id',
                'user.full_name as name'
            )
            .join(
                'justforfund_users as user',
                'purchase.user_id',
                'user.id'
            )
            .where('purchase.id', id)
            .first()
    },
    getAllByBudgetId(db, id){
        return db
            .from('justforfund_purchases as purchase')
            .select(
                'purchase.id',
                'purchase.date',
                'purchase.amount',
                'purchase.category',
                'purchase.budget_id',
                'user.full_name as name'
            )
            .join(
                'justforfund_users as user',
                'purchase.user_id',
                'user.id'
            )
            .where('budget_id', id)
            .orderBy('purchase.date', 'desc')
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