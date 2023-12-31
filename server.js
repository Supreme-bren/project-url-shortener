const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: Number,

    }

})

module.exports = mongoose.model('Db1', userSchema)