const restful = require('node-restful')

const mongoose = restful.mongoose

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, require: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    _idHospital: {type: mongoose.Schema.Types.ObjectId, ref: 'Hospital'  }
})

module.exports = restful.model('User', userSchema)