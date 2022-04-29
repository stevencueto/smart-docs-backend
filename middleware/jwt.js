const jwt = require('jsonwebtoken')
const handler = require('./serverError')

module.exports = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if(!token){
        return handler("Token Must be provided", res ,"Token Must be provided" )
    }
    jwt.verify(token, process.env.TOKEN_GENERATOR, (err, decoded)=> {
        if (err) {
            return handler(err?.message, res , err?.message)
        }else{
            req.user = decoded?.user
            return next()
        }
    });
}