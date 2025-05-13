const Hospital = require('./hospital')

Hospital.methods(['get', 'post', 'put', 'delete'])
Hospital.updateOptions({ new: true, runValidators: true })

module.exports = Hospital