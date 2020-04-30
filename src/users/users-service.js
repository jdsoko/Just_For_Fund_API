const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getAllUsers(db){
        return db
        .from('justforfund_users')
        .select('*')
    },
    hasUserWithUserName(db, user_name){
        return db('justforfund_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
    getUserIdWithUserName(db, user_name){
        return db
        .from('justforfund_users')
        .select('id')
        .where('user_name', user_name)
        .then(([id]) => id)
    },
    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('justforfund_users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(password){
        if(password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if(password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if(password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
            return 'Password must contain at least one upper case, one lower case, one number, and one special character'
        }
        return null
    },
    /* hashPassword(password){
        return bcrypt.hash(password, 12)
    }, */
    serializeUser(user){
        return {
            id: user.id,
            full_name: xss(user.full_name),
            user_name: xss(user.user_name),
        }
    },
    getAllPermissions(db){
        return db
        .from('justforfund_permissions')
        .select('*')
    },
    insertNewPermission(db, newPerm){
        return db
            .insert(newPerm)
            .into('justforfund_permissions')
            .returning('*')
            .then(([perm]) => perm)
    }
}

module.exports = UsersService