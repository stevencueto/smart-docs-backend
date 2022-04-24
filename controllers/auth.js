const express = require('express')
const router = express.Router()
const User = require('../models/User')
const catchErr = require('../middleware/serverError')
const { hashedPassword, comparePassword} = require('../middleware/passwordHasser')
const userExists = require('../middleware/userExists')
const verify = require('../middleware/jwt')
const sendUser = require('../middleware/sendUser')
const axios = require('axios')
const mongoose = require('mongoose')
router.post('/register', userExists,  async (req, res) => {
    if(req.body.password === undefined || req.body.password === "" ) return catchErr("No Password", res, 'No Password')
    req.body.password = hashedPassword(req.body.password)
    try{
        const user = await User.create(req.body)
        return sendUser(user, res)
        
    }catch(err){
        catchErr(err, res, 'Interal Server Error')
    }
})

router.post( '/login', async(req, res) =>{
    try{
    const possibleUser = await User.findOne({email: req.body.email})
    if(possibleUser){
        const okpass = comparePassword(req.body.password, possibleUser.password)
        if(okpass){
            return sendUser(possibleUser, res)
        }else{
            return catchErr(possibleUser, res, "Wrong Password")
        }
    }
    return catchErr(possibleUser, res, "No Matching Credentials in The DBS")
    }catch(err){
        return catchErr(err, res, "Something went wrong with that request")
    }
})
router.use('/', verify)
router.put('/', async(req, res) =>{
    try{
    const possibleUser = await User.findByIdAndUpdate(req.user._id, req.body)
    possibleUser.password = null
    if(possibleUser){
        return sendUser(possibleUser, res)
    }
    return catchErr(possibleUser, res, "No Matching Credentials in The DBS")
    }catch(err){
        return catchErr(err, res, "Something went wrong with that request")
    }
})

router.put('/newpass', async(req, res) =>{
    try{
        console.log(req.user._id)
        const possibleUser = await User.findById(req.user._id)
        if(possibleUser){
            const okpass = comparePassword(req.body.password, possibleUser.password)
            if(okpass){
                req.body.password = hashedPassword(req.body.newPassword)
                const newUser = await User.findByIdAndUpdate(req.user._id, req.body)
                return sendUser(newUser, res)
            }else{
                return catchErr(possibleUser, res, "Wrong Password")
            }
        }
        return catchErr(possibleUser, res, "unable to find user")
    }catch(err){
        return catchErr(err, res, "Something went wrong with that request")
    }
})

router.delete('/', async (req, res)=>{
    try{
        const possibleUser = await User.findById(req.user._id)
        const okpass = comparePassword(req.body.password, possibleUser.password)
        if(okpass){
            const deleted = await axios.delete("http://localhost:3003/micro/", {
                headers: { "x-access-token": req.headers["x-access-token"] }})
            if(deleted.data.success){
                await User.findByIdAndDelete(req.user._id) //to delete user by their passport 
                return res.send({
                    success: true,
                    data: 'you is gone from my dbs'
                })
            }else{
                return catchErr(deleted.data, res, "deleted")
            }
        }
        return catchErr(okpass, res, "when you remember your password then delete your profile lol")
    }catch(err){
        return catchErr(err, res, "Something went wrong with that request")
    }
})


module.exports = router;