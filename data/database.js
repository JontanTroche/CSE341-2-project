const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

let database;

const initDb = async (callback) => {
    if(database) {
        console.log('Db is already initialized!');
        return callback(null, database);
    } 
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        database = mongoose.connection;
        console.log('Successfully connected to MongoDB with Mongoose!');
        callback(null, database);
    } catch (err) {
        console.error('Errorconnecting to MongoDB: ', err);
        callback(err);
    }
};

const getDatabase = () => {
    if(!database) {
        throw Error('Database not initialized')
    } 
    return database;
};

module.exports = {
    initDb,
    getDatabase
};