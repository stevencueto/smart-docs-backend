const User = require('../models/User');
const catchErr = require('./serverError')
module.exports = async (req, res, next)=>{ //this function I (Steven) feel very proud of it! 
    const {username, email} = req.body
    try{
        const userExists = await User.findOne({username: username}) //this function will try to find one with the email or the username
        if(userExists){ //if not ull
            return res.send({
                success: false,
                data: 'User Already Exist!'
            })
        }
        const emailExist = await User.findOne({email: email})
        if(emailExist){
           return catchErr(emailExist, res, 'Email In Use!')
        }
    }catch(err){
        return catchErr(err, res, 'Interal Server Error')
    }
    next()//if not on dbs will next
}