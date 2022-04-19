const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Docs = require('../models/Docs')
const catchErr = require('../middleware/serverError')
const { hashedPassword, comparePassword} = require('../middleware/passwordHasser')
const userExists = require('../middleware/userExists')
const jwt = require('jsonwebtoken')


router.post('/register', userExists,  async (req, res) => {
    req.body.password = hashedPassword(req.body.password)
    try{
        const newUser = await User.create(req.body)
        console.log(newUser)
        const token = jwt.sign(
            {
                username: newUser.username,
                email: newUser.email,
                docs: newUser.favoriteMovies,
                _id: newUser._id
            },
            process.env.TOKEN_GENERATOR
        )
        return res.send({
            success: true,
            data: token
        })
    }catch(err){
        catchErr(err, res, 'Interal Server Error')
    }
})

router.post( '/login', async(req, res) =>{
    console.log(req.body)
    try{
    const possibleUser = await User.findOne({email: req.body.email})
    if(possibleUser){
        const okpass = comparePassword(req.body.password, possibleUser.password)
        if(okpass){
            const token = jwt.sign(
                {
                    username: possibleUser.username,
                    email: possibleUser.email,
                    _id: possibleUser._id,
                    docs: possibleUser.docs,
                },
                process.env.TOKEN_GENERATOR
            )
            return res.send({
                success: true,
                data: token
            })
        }else{
            return catchErr(possibleUser, res, "Wrong Password")
        }
    }
    return catchErr(possibleUser, res, "No Matching Credentials in The DBS")
    }catch(err){
        return catchErr(err, res, "Something went wrong with that request")
    }
})

router.put('/edit', async(req, res) =>{
    const token = req.headers["x-access-token"]
    const decoded = jwt.verify(token, process.env.TOKEN_GENERATOR)
	const id = decoded._id
    if(!id) return catchErr(id, res, "User not found")
    try{
    const possibleUser = await User.findByIdAndUpdate(id, req.body)
    if(possibleUser){
        const token = jwt.sign(
            {
                username: possibleUser.username,
                email: possibleUser.email,
                _id: possibleUser._id,
                docs: possibleUser.docs,
            },
            process.env.TOKEN_GENERATOR
        )
        return res.send({
            success: true,
            data: token
        })}
    return catchErr(possibleUser, res, "No Matching Credentials in The DBS")
    }catch(err){
        return catchErr(err, res, "Something went wrong with that request")
    }
})
router.delete('/:id', async (req, res)=>{
    const token = req.headers["x-access-token"]
    const decoded = jwt.verify(token, process.env.TOKEN_GENERATOR)
	const id = decoded._id
    if(!id) return catchErr(id, res, "User not found")
    try{
        await Docs.deleteMany({username: id }) // deletes user's existing items  
        await User.findByIdAndDelete(id) //to delete user by their passport 
        return res.send({
            success: true,
            data: "User Deleted"
        })
    }catch(err){
        return catchErr(err, res, "Something went wrong with that request")
    }
  })






















module.exports = router;