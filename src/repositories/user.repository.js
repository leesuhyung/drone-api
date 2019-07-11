const mongoose = require('mongoose');
const {BaseRepository} = require('./base.repository');

class UserRepository extends BaseRepository {
    constructor() {
        super();
        this.setModel('User');
    }

    async ranking() {
        const Result = mongoose.models['Result'];
        const users = await this.model.find();

        return await Promise.all(users.map(async (user) => {
            let userObj = user.toObject();

            let getResultData = async () => {
                return await Result.aggregate([
                    // todo: winData, loseData, totalData + elo Rank
                    {
                        $match: {
                            winner: user._id
                        }
                    },
                    {
                        $project: {
                            '_id': '$_id',
                            'winner': '$winner'
                        }
                    }
                ]).then(items => items[0]);
            };

            userObj.resultData = await getResultData();
            return userObj;
        }))
    }
}

exports.UserRepository = UserRepository;
