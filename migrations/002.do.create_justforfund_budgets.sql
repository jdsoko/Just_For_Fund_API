CREATE TABLE justforfund_budgets(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    budget_name TEXT NOT NULL,
    budget_limit NUMERIC (10,2) NOT NULL
);