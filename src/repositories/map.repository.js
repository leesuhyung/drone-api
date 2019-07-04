const {BaseRepository} = require('./base.repository');

class MapRepository extends BaseRepository {
    constructor() {
        super();
        this.setModel('Map');
    }
}

exports.MapRepository = MapRepository;
