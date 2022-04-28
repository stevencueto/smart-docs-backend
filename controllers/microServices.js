const express = require('express')
const router = express.Router()
const User = require('../models/User')
const catchErr = require('../middleware/serverError')
const verify = require('../middleware/jwt')
const sendUser = require('../middleware/sendUser')
const mongoose = require('mongoose')



router.use('/', verify)
router.get('/:id', async(req, res) =>{
    try{
        const friend = await User.findById(req.user._id)
        res.send({
            success: true,
            data: friend._id
        })
    }catch(err){
        return catchErr(err, res, "friend not found")
    }
})

module.exports = router;