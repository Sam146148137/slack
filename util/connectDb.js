const mongoose = require('mongoose');

async function connectToDb() {
    await mongoose.connect(process.env.DB_CONNECT_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Successfully connected to mongo.')
}

module.exports = connectToDb;