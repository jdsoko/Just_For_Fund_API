CREATE TABLE justforfund_purchases (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    user_id INTEGER REFERENCES justforfund_users(id),
    budget_id INTEGER REFERENCES justforfund_budgets(id)
)