const BudgetsService = {
    getAllBudgets(db) {
        return db
        .from('justforfund_budgets AS budget')
        .select(
            'budget.id',
            'budget.budget_name',
            'budget.budget_limit',
            db.raw(
                'SUM(purchases.amount) as purchase_total'
            ),
        )
        .leftJoin(
            'justforfund_purchases AS purchases',
            'budget.id',
            'purchases.budget_id'
        )
        
        .groupBy('budget.id')
        .orderBy('budget.id', 'asc')
       
    },
    getByUserId(db, user_id){
        return db
        .from('justforfund_budgets AS budget')
        .select(
            'budget.id',
            'budget.budget_name',
            'budget.budget_limit',
            db.raw(
                'SUM(purchases.amount) as purchase_total'
            ),
        )
        .join(
            'justforfund_permissions AS permissions',
            'budget.id',
            'permissions.budget_id'
            )
        .leftJoin(
            'justforfund_purchases AS purchases',
            'permissions.budget_id',
            'purchases.budget_id'
        )
        .where('permissions.user_id', user_id)
        .groupBy('budget.id')
        .orderBy('budget.id', 'asc')
    },
    getByBudgetId(db, id){
        return db
            .from('justforfund_budgets AS budget')
            .select(
                'budget.id',
                'budget.budget_name',
                'budget.budget_limit'
            )
            .where('budget.id', id)
            .first()
    },
    insertBudget(db, newBudget) {
        return db
            .insert(newBudget)
            .into('justforfund_budgets')
            .returning('*')
            .then(([budget]) => budget)
            .then(budget => 
                BudgetsService.getByBudgetId(db, budget.id)
            )
    }
}

module.exports = BudgetsService