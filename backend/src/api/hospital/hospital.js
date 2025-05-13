const restful = require('node-restful')
const mongoose = restful.mongoose

const hospitalSchema = new mongoose.Schema({
    name: { Type: String, required: true },
    address: { Type: String, require: true },
    email: { Type: String, require: true },
    password: {Type:String, required: true}
})

module.exports = restful.model('Hospital', hospitalSchema)