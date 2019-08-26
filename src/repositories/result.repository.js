const {BaseRepository} = require('./base.repository');

class ResultRepository extends BaseRepository {
    constructor() {
        super();
        this.setModel('Result');
    }

    async list(filters, page, limit) {
        return await this.model.countDocuments(filters).then(async count => {
            const results = await this.model.find(filters)
                .limit(parseInt(limit))
                .skip((page - 1) * limit)
                .sort('-createdAt')
                .deepPopulate('loser winner creator map');

            return {
                total: count,
                finish: count <= page * limit,
                items: results,
            }
        });
    }

    async get(id) {
        return await this.model.findById(id).deepPopulate('loser winner creator map');
    }

    async delete(id) {
        return await this.model.findOne({_id: id}).then(async result => {
            result.remove();
        })
    }
}

exports.ResultRepository = ResultRepository;
