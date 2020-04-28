BEGIN;

TRUNCATE
    justforfund_users,
    justforfund_budgets,
    justforfund_permissions,
    justforfund_purchases
RESTART IDENTITY CASCADE;

INSERT INTO justforfund_users (full_name, user_name, password)
VALUES
('John Sokolowski', 'jdsoko', 'Waffle96!'),
('Demo User', 'demo-user', 'Pass123');

INSERT INTO justforfund_budgets (budget_name, budget_limit)
VALUES
('Monthly Budget', 800.00),
('Friend''s Birthday', 250.00),
('Christmas Shopping', 300.00);

INSERT INTO justforfund_permissions (user_id, budget_id)
VALUES
(1, 1),
(1, 2),
(2, 3);

INSERT INTO justforfund_purchases (date, amount, category, user_id, budget_id)
VALUES
('01/20/20', 23.81, 'Transportation', 1, 1),
('01/21/20', 78.44, 'Groceries', 1, 1),
('01/21/20', 9.99, 'Subscriptions', 1, 1),
('01/22/20', 169.99, 'Bills', 1, 1),
('01/20/20', 19.49, 'Supplies', 1, 2),
('01/21/20', 23.99, 'Snacks', 1, 2),
('01/20/20', 18.99, 'Gifts', 2, 3),
('01/20/20', 34.99, 'Gifts', 2, 3),
('01/21/20', 10.03, 'Gifts', 2, 3);


COMMIT;