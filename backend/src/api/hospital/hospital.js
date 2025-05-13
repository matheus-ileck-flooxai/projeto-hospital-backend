const restful = require('node-restful')
const mongoose = restful.mongoose

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, required: true }
})

module.exports = restful.model('Hospital', hospitalSchema)