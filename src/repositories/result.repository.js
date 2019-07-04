const {BaseRepository} = require('./base.repository');

class ResultRepository extends BaseRepository {
    constructor() {
        super();
        this.setModel('Result');
    }

    async list(params) {
        return await this.model.find(params).deepPopulate('loser winner creator map');
    }

    async get(id) {
        return await this.model.findById(id).deepPopulate('loser winner creator map');
    }
}

exports.ResultRepository = ResultRepository;
