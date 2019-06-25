const mongoose = require('mongoose');

class BaseRepository {
    constructor(model) {
        this.model = model;
        this.isConnected = false;
        this.connectDB();
    }

    async connectDB() {
        if (this.isConnected) {
            return Promise.resolve();
        }

        try {
            await mongoose.connect(process.env.MONGODB_URL);
            this.isConnected = true;
        } catch (e) {
            console.log(e);
        }
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
