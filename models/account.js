const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Account = new Schema({
    login: String,
    passe: String,
    role: String
});


module.exports = mongoose.model('Account', Account);