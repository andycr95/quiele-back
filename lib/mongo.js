const mongoose = require('mongoose')
const { config } = require('../config/index');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = config.dbHost;

mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${MONGO_URI}/${DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(db => console.log("Connect to DB"))
    .catch(err => console.log(err))

module.exports = mongoose
