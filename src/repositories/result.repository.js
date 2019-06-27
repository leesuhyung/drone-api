const {BaseRepository} = require('./base.repository');
const Result = require('../models/Result');

class ResultRepository extends BaseRepository {
    constructor() {
        super(Result)
    }

    async list(params) {
        return await this.model.find(params)
            // .populate('loser.user');
    }
}

exports.ResultRepository = ResultRepository;
