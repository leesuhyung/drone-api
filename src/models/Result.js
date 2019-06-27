const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
    user: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    elo: {
        before: {type: Number, required: true},
        after: {type: Number, required: true},
        increment: {type: Number, required: true},
    }
});

const loserSchema = new mongoose.Schema({
    user: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    elo: {
        before: {type: Number, required: true},
        after: {type: Number, required: true},
        decrement: {type: Number, required: true},
    }
});

const schema = new mongoose.Schema({
    set: {
        type: {},
        total: {type: Number},
        current: {type: Number},
        default: null,
    },
    winner: winnerSchema,
    loser: loserSchema,
    map: {
        type: String,
        required: true,
    },
    memo: {
        type: String
    },
    createdUser: {
        type: 'ObjectId',
        ref: 'User',
        required: true
    },
    resultedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.Result || mongoose.model('Result', schema);
