const express = require('express')
const router = express.Router()
const User = require('../models/User')
const catchErr = require('../middleware/serverError')
const verify = require('../middleware/jwt')
const sendUser = require('../middleware/sendUser')
const mongoose = require('mongoose')
const axios = require('axios')
const { comparePassword} = require('../middleware/passwordHasser')



router.use('/', verify)
router.get('/:id', async(req, res) =>{
    try{
        const friend = await User.findById(req.user._id)
        delete friend.password
        delete friend.email
        res.send({
            success: true,
            data: friend
        })
    }catch(err){
        return catchErr(err, res, "friend not found")
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