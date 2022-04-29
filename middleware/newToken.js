const jwt = require('jsonwebtoken')
module.exports = (user) =>{
    user.password = null
        const token = jwt.sign(
            {user},
            process.env.TOKEN_GENERATOR
        )
        return token
}