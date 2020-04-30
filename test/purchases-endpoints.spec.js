const knex = require('knex')
const app = require('../src/app')

describe('Purchases Endpoints', function(){
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

    describe('POST /api/purchases', () => {
        const testBudget = { id: 1, budget_name: 'test-budget', budget_limit: 200}
        const testUser = {
            id: 1,
            full_name: 'fullname',
            user_name: 'user_name',
            password: 'password'
        }
        this.beforeEach('insert test budget', () => {
            return db
                .into('justforfund_budgets')
                .insert(testBudget)
                .then(() => 
                db
                    .into('justforfund_users')
                    .insert(testUser)
                )
        })
        it(`creates a purchase, responding with 201 and the new purchase`, function(){
            this.retries(3)

            const newPurchase = {
                date: '02/20/20',
                amount: 20.00,
                category: 'Gas',
                user_id: testUser.id,
                budget_id: testBudget.id
            }
            return supertest(app)
            .post('/api/purchases')
            .send(newPurchase)
            .expect(201)
            .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.date).to.eql(newPurchase.date)
                expect(res.body.amount).to.eql(newPurchase.amount)
                expect(res.body.category).to.eql(newPurchase.category)
                
                expect(res.headers.location).to.eql(`/api/purchases/${res.body.id}`)
            })
        })

        const requiredFields = ['date', 'amount', 'category', 'user_id', 'budget_id']
        
        requiredFields.forEach(field => {
            const newPurchase = {
                date: '02/20/20',
                amount: 20.00,
                category: 'Gas',
                user_id: testUser.id,
                budget_id: testBudget.id
            }

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newPurchase[field]

            return supertest(app)
                .post('/api/purchases')
                .send(newPurchase)
                .expect(400, {
                    error: `Missing '${field}' in request body`,
                })
            })
        }) 
    })
})