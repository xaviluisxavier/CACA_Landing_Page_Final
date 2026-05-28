const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Não permite emails repetidos
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Permissões básicas
        default: 'user'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
