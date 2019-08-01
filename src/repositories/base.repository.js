const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
require('../models/User');
require('../models/Result');
require('../models/Map');

class BaseRepository {

    constructor() {
    }

    setModel(model) {
        this.model = mongoose.models[model];
    }

    async connect() {
        if (mongoose.connection.readyState === 1) {
            return Promise.resolve();
        }

        return await mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
    }

    async post(item) {
        return await this.model.create(item);
    }

    async get(id) {
        return await this.model.findById(id);
    }

    async list(params) {
        return await this.model.find(params);
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async update(id, user) {
        return await this.model.findByIdAndUpdate(id, user, {'new': true});
    }
}

exports.BaseRepository = BaseRepository;
