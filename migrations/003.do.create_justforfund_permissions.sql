CREATE TABLE justforfund_permissions(
    user_id INTEGER NOT NULL  REFERENCES justforfund_users(id),
    budget_id INTEGER NOT NULL  REFERENCES justforfund_budgets(id) ON DELETE CASCADE
)