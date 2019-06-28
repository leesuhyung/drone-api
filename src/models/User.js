const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    auth0Sub: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    nick: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        battleCode: {type: String},
        kakaoId: {type: String},
        phone: {type: String},
    },
    tier: {
        type: String,
        required: true,
        enum: ['challenger', 'major', 'minor', 'triple'],
    },
    tribe: {
        type: String,
        required: true,
        enum: ['protoss', 'terran', 'zerg'],
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    elo: {
        type: Number,
    }
});
schema.pre('save', function (next) {
    if (!this.elo) {
        this.elo = 1000;
    }
    next();
});
module.exports = mongoose.models.User || mongoose.model('User', schema);
