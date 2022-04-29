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
const newToken = require('../middleware/newToken')
const makeAvatar = require('../middleware/axiosAvatar')

router.post('/register', userExists,  async (req, res) => {
    if(req.body.password === undefined || req.body.password === "" ) return catchErr("No Password", res, 'No Password')
    req.body.password = hashedPassword(req.body.password)
    try{
        const newAvatar =makeAvatar(req.body.name)
        const user = await User.create(req.body)
        const token = newToken(user)
        const auth = {
            headers: {"x-access-token": token} 
        }
        const friends = await axios.post("http://localhost:3004/micro/",{"nada": 'todo'},  auth)
        const axiosAv = await axios.request(newAvatar)
            if(friends.data.success){
                const newUser = await User.findByIdAndUpdate(user._id, {friends: mongoose.Types.ObjectId(friends.data.friends), profilePic: axiosAv.data})
                return sendUser(newUser, res)
            }else{
                await User.findByIdAndDelete(user._id)
                return catchErr(friends.data?.data, res, 'no friends')
            }
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



module.exports = router;