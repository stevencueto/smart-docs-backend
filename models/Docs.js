const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const docsSchema = new Schema({
  title: {
    type: String,
    unique: true,
    },
  data: {
      type: Object,
    },
  description: {
        type: String
  },
  allowedUsers:[
    {
      type: Schema.Types.ObjectId,
        ref: 'User',
        sparse:true
      }
    ],
  public: {
    type: Boolean,
    default: false
  },
},{timestamps: true})


const Docs = mongoose.model('Docs', docsSchema)
module.exports = Docs;