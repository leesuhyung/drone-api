const mongoose = require('mongoose');

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async connect() {
        if (mongoose.connection.readyState === 1) {
            return Promise.resolve();
        }

        return await mongoose.connect(process.env.MONGODB_URL);
    }

    async post(item) {
        return await this.model.create(item);
    }

    async get(id) {
        return await this.model.findById(id);
    }

    async list() {
        return await this.model.find();
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async update(id, user) {
        return await this.model.findByIdAndUpdate(id, user, {'new': true});
    }
}

exports.BaseRepository = BaseRepository;
