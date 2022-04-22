const jwt = require('jsonwebtoken')
module.exports = (user, res) =>{
    user.password = null
        const token = jwt.sign(
            {user},
            process.env.TOKEN_GENERATOR
        )
        return res.send({
            success: true,
            data: {token, user}
        })
}