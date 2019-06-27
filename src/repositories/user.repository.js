const {BaseRepository} = require('./base.repository');

class UserRepository extends BaseRepository {
    constructor() {
        super();
        this.setModel('User');
    }

}

exports.UserRepository = UserRepository;
