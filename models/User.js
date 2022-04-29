const mongoose = require('mongoose')
const Schema = mongoose.Schema



const userSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: false
        },
        password: {
            type: String,
            required: true,
        },
        profilePic:{
            type: String,
            required: false,
        },
        docs:[ 
            {
            type: Schema.Types.ObjectId,
            ref: 'Docs',
            sparse:true
            }
        ],
        friends: 
            {
            type: Schema.Types.ObjectId,
            ref: 'Friends',
            unique: false,
            sparse:true

            }
        ,
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;