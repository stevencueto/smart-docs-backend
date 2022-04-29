const jwt = require('jsonwebtoken')
module.exports = (user, res) =>{
    delete user.password
    const newUser = {username :user.username, _id: user._id}
        const token = jwt.sign(
            {user: newUser},
            process.env.TOKEN_GENERATOR
        )
        return res.send({
            success: true,
            data: {token, user: user}
        })
}