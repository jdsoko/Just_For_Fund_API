const knex = require('knex')
const app = require('../src/app')

describe('Budget Endpoints', function(){
    let db

    function cleanTables(db){
        return db.raw(
            `TRUNCATE
                justforfund_users,
                justforfund_budgets,
                justforfund_purchases
                RESTART IDENTITY CASCADE`
        )
    }

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => cleanTables(db))
    afterEach('cleanup', () => cleanTables(db))

    describe(`GET /api/budgets`, () => {
        context(`Given no budgets`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/budgets')
                    .expect(200, [])
            })
        })
        context('Given there are budgets', () => {
            const testBudget = {id: 1, budget_name: 'test-name', budget_limit: 200}
            const expectedBudget = {
                id:1,
                budget_name: 'test-name',
                budget_limit: 200
            }
            beforeEach('insert test budget', () => {
                return db
                    .into('justforfund_budgets')
                    .insert(testBudget)
            })
            it('responds with 200 and all of the things', () => {
                return supertest(app)
                    .get('/api/budgets')
                    .expect(200, [expectedBudget])
            })

        })
    })
    describe('GET /api/budget/:budget_id', () => {
        context('Given no budgets', () => {
            it('responds with 404', () => {
                return supertest(app)
                    .get('/api/budgets/1')
                    .expect(404, { error: `budget does not exist` })
            })
        })
        context('Given there are budgets', () => {
            const testBudget = { id: 1, budget_name: 'test_name', budget_limit: 200}
            const expectedBudget = { id: 1, budget_name: 'test_name', budget_limit: 200}

            beforeEach('insert test budget', () => {
                return db
                    .into('justforfund_budgets')
                    .insert(testBudget)
            })
            it('responds with 200 and the specific budget', () => {
                return supertest(app)
                    .get('/api/budgets/1')
                    .expect(200, expectedBudget)
            })
        })
    })
})