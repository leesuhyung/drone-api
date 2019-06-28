const mongoose = require('mongoose');
let deepPopulate = require('mongoose-deep-populate')(mongoose);

const schema = new mongoose.Schema({
    set: {
        type: {},
        total: {type: Number},
        current: {type: Number},
        default: null,
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
        type: String,
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
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

schema.plugin(deepPopulate);
schema.pre('save', async function() { // save 직전 실행 미들웨어.
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
                self.elo = K * (1 - (Math.round((1 / (1+(Math.pow(10, (loserElo - winnerElo) / 400) ))) * 10) / 10));
            }

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    if (this.isNew) {
        await setElo();
    }

    /*
    승리: 이전 점수 + (기준 점수)×(1 - 내 예상 승률)
        내 예상 승률: (Math.round((1 / (1+(Math.pow(10, (상대방elo - 내elo) / 400) ))) * 1000) / 10);
    패배: 이전 점수 + (기준 점수)×(0 - 내 예상 승률)
        내 예상 승률: (Math.round((1 / (1+(Math.pow(10, (상대방elo - 내elo) / 400) ))) * 1000) / 10);
    여기서 상수 10은 임의의 K 값. (10으로 고정)

    예)
    A 의 현재 ELO = 1023 => 기대승률 44.4%
    B 의 현재 ELO = 1062 => 기대승률 55.6%

    A승리: 이전 점수 + (기준 점수K)×(1 - 내 예상 승률)
        => 1023 + (10)*(1-0.444)
        => 1023 + 5.56
        => 1028.56

    A패배: 이전 점수 + (기준 점수K)×(0 - 내 예상 승률)
        => 1023 + (10)*(0-0.444)
        => 1023 + (-4.44))
        => 1018.56

    B승리: 이전 점수 + (기준 점수K)×(1 - 내 예상 승률)
        => 1062 + (10)*(1-0.556)
        => 1062 + 4.44
        => 1066.44

    B패배: 이전 점수 + (기준 점수K)×(0 - 내 예상 승률)
        => 1062 + (10)*(0-0.556)
        => 1062 + (-5.56))
        => 1056.44
     */

});

// todo: result post 이후 생성된 result.elo 값으로 winner, loser 유저 elo 값 수정.

module.exports = mongoose.models.Result || mongoose.model('Result', schema);
