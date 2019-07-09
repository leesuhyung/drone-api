const mongoose = require('mongoose');
let deepPopulate = require('mongoose-deep-populate')(mongoose);

const schema = new mongoose.Schema({
    set: {
        isSet: {type: Boolean, default: false},
        total: {type: Number, default: 0},
        current: {type: Number, default: 0},
    },
    winner: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    winnerData: {
        lastElo: {type: Number},
        tier: {type: String, enum: ['challenger', 'major', 'minor', 'triple']}
    },
    loser: {
        type: 'ObjectId',
        ref: 'User',
        required: true,
    },
    loserData: {
        lastElo: {type: Number},
        tier: {type: String, enum: ['challenger', 'major', 'minor', 'triple']}
    },
    occurElo: {
        type: Number
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
            let winner = await user.findById(self.winner, 'tier elo');
            let loser = await user.findById(self.loser, 'tier elo');

            if (winner.elo === loser.elo) {
                self.occurElo = 5;
            } else {
                self.occurElo = K * (1 - (Math.round((1 / (1 + (Math.pow(10, (loser.elo - winner.elo) / 400)))) * 10) / 10));
            }

            self.winnerData.lastElo = winner.elo;
            self.loserData.lastElo = loser.elo;
            self.winnerData.tier = winner.tier;
            self.loserData.tier = loser.tier;

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
            await user.findByIdAndUpdate(doc.winner, {$inc: {elo: doc.occurElo}});
            await user.findByIdAndUpdate(doc.loser, {$inc: {elo: doc.occurElo * (-1)}});
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    await setElo();
});
module.exports = mongoose.models.Result || mongoose.model('Result', schema);
