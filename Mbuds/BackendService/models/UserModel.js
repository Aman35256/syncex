const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userNickName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPhone: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("UserModel", UserSchema);

