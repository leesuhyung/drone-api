const {BaseRepository} = require('./base.repository');

class ResultRepository extends BaseRepository {
    constructor() {
        super();
        this.setModel('Result');
    }

    async list(params) {
        return await this.model.find(params).deepPopulate('loser winner creator');
    }
}

exports.ResultRepository = ResultRepository;
