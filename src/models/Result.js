const mongoose = require('mongoose');
let deepPopulate = require('mongoose-deep-populate')(mongoose);

const schema = new mongoose.Schema({
    set: {
        type: {},
        isSet: {type: Boolean, default: false},
        total: {type: Number, default: 0},
        current: {type: Number, default: 0},
    },
    winner: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    loser: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    elo: {
        type: Number,
    },
    map: {
        type: 'ObjectId',
        ref: 'Map',
        required: true,
    },
    memo: {
        type: String,
    },
    creator: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    resultedAt: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

schema.plugin(deepPopulate);
schema.pre('save', async function () { // save 직전 실행 미들웨어.
    const self = this;
    const K = 10;
    const user = mongoose.model('User');

    async function setElo() {
        try {
            let winnerElo = await user.findById(self.winner, '-_id elo')
                .then((user) => user.elo);
            let loserElo = await user.findById(self.loser, '-_id elo')
                .then((user) => user.elo);

            if (winnerElo === loserElo) {
                self.elo = 5;
            } else {
                self.elo = K * (1 - (Math.round((1 / (1 + (Math.pow(10, (loserElo - winnerElo) / 400)))) * 10) / 10));
            }

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    if (this.isNew) {
        await setElo();
    }
});
schema.post('save', async function (doc) {
    const user = mongoose.model('User');

    async function setElo() {
        try {
            await user.findByIdAndUpdate(doc.winner, {$inc: {elo: doc.elo}});
            await user.findByIdAndUpdate(doc.loser, {$inc: {elo: doc.elo * (-1)}});
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    await setElo();
});
module.exports = mongoose.models.Result || mongoose.model('Result', schema);
