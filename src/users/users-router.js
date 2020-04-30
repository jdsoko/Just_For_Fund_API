express = require('express')
UsersService = require('./users-service')

usersRouter = express.Router()
jsonBodyParser = express.json()

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users)
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const {user_name, full_name, password} = req.body
        for (const field of ['full_name', 'user_name', 'password'])
        if(!req.body[field])
        return res.status(400).json({
            error: `Missing '${field}' in request body`
        })
        const passwordError = UsersService.validatePassword(password)
        
        if(passwordError)
            return res.status(400).json({ error: passwordError })
       
        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )   
            .then(hasUserWithUserName => {
                if(hasUserWithUserName)
                return res.status(400).json({ error: `Username already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            full_name,
                        }
                    
                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                        .then(user => {
                            res
                                .status(201)
                                .location(`api/users/${user.id}`)
                                .json(UsersService.serializeUser(user))
                        })
                    })
                    .catch(next)
            })

        usersRouter
            .route('/permissions')
            .get((req, res, next) => {
                UsersService.getAllPermissions(req.app.get('db'))
                    .then(permissions => {
                        res.json(permissions)
                    })
                    .catch(next)
            })
            .post(jsonBodyParser, (req, res, next) => {
                const {user_name, budget_id} = req.body
                
                for(const field of ['user_name', 'budget_id'])
                if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

                UsersService.hasUserWithUserName(
                    req.app.get('db'),
                    user_name
                )
                .then(hasUserWithUserName => {
                    if(!hasUserWithUserName)
                    return res.status(400).json({ error: `User '${user_name}' does not exist` })
                    
                })
                
                UsersService.getUserIdWithUserName(
                    req.app.get('db'),
                    user_name
                )
                .then(user_id => {
                    user_id = user_id.id
                    
                    return UsersService.insertNewPermission(
                        req.app.get('db'),
                        {
                           user_id,
                            budget_id
                        }
                    )
                    .then(permission => {
                        res
                            .status(201)
                            .json(permission)
                    })

                })
                    
                })
                .catch(next)

                

            })
    
 module.exports = usersRouter   