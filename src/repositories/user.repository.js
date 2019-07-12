const mongoose = require('mongoose');
const {BaseRepository} = require('./base.repository');

class UserRepository extends BaseRepository {
    constructor() {
        super();
        this.setModel('User');
    }

    async ranking() {
        const Result = mongoose.models['Result'];
        // const users = await this.model.find();
        const users = await this.model.aggregate([
            {
                $sort: {
                    'elo': -1
                }
            },
            {
                $group: {
                    _id: {},
                    items: {$push: '$$ROOT'}
                }
            },
            {
                $unwind: {
                    path: '$items',
                    includeArrayIndex: 'items.rank'
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$items'
                }
            },
            {
                $sort: {
                    'rank': 1
                }
            },
        ]);

        return await Promise.all(users.map(async (user) => {
            user.resultData = await Result.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'loser',
                            foreignField: '_id',
                            as: 'loser'
                        }
                    },
                    {
                        $unwind: '$loser'
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'winner',
                            foreignField: '_id',
                            as: 'winner'
                        }
                    },
                    {
                        $unwind: '$winner'
                    },
                    {
                        $group: {
                            _id: {},
                            totalCount: {$sum: {
                                $cond: [{$or: [{$eq: ['$winner._id', user._id]}, {$eq: ['$loser._id', user._id]}]}, 1, 0]
                            }},
                            winCount: {$sum: {
                                $cond: [{$eq: ['$winner._id', user._id]}, 1, 0]
                            }},
                            loseCount: {$sum: {
                                $cond: [{$eq: ['$loser._id', user._id]}, 1, 0]
                            }},
                            winVsZerg: {$sum: {
                                $cond: [{$and: [{$eq: ['$winner._id', user._id]}, {$eq: ['$loser.tribe', 'zerg']}]}, 1, 0]
                            }},
                            winVsProtoss: {$sum: {
                                    $cond: [{$and: [{$eq: ['$winner._id', user._id]}, {$eq: ['$loser.tribe', 'protoss']}]}, 1, 0]
                            }},
                            winVsTerran: {$sum: {
                                $cond: [{$and: [{$eq: ['$winner._id', user._id]}, {$eq: ['$loser.tribe', 'terran']}]}, 1, 0]
                            }},
                            loseVsZerg: {$sum: {
                                $cond: [{$and: [{$eq: ['$loser._id', user._id]}, {$eq: ['$winner.tribe', 'zerg']}]}, 1, 0]
                            }},
                            loseVsProtoss: {$sum: {
                                    $cond: [{$and: [{$eq: ['$loser._id', user._id]}, {$eq: ['$winner.tribe', 'protoss']}]}, 1, 0]
                            }},
                            loseVsTerran: {$sum: {
                                $cond: [{$and: [{$eq: ['$loser._id', user._id]}, {$eq: ['$winner.tribe', 'terran']}]}, 1, 0]
                            }},
                        }
                    },
                    {
                        $addFields: {
                            total: '$totalCount',
                            win: {
                                count: '$winCount',
                                vsZ: '$winVsZerg',
                                vsP: '$winVsProtoss',
                                vsT: '$winVsTerran',
                            },
                            lose: {
                                count: '$loseCount',
                                vsZ: '$loseVsZerg',
                                vsP: '$loseVsProtoss',
                                vsT: '$loseVsTerran',
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalCount: 0,
                            winCount: 0,
                            loseCount: 0,
                            winVsZerg: 0,
                            winVsProtoss: 0,
                            winVsTerran: 0,
                            loseVsZerg: 0,
                            loseVsProtoss: 0,
                            loseVsTerran: 0,

                        }
                    },
                    {
                        $match: {
                            'total': {$ne: 0}
                        }
                    },
                ]).then(items => items[0]);

            return user;
        }))
    }
}

exports.UserRepository = UserRepository;
