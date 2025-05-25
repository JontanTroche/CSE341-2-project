const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('DTproject').find();
    result.toArray().then((albums) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(albums);
    });
};

const getSingle = async (req, res) => {
    const albumsid = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('DTproject').find( {_id: albumsid});
    result.toArray().then((albums) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(albums[0]);
    });
};

module.exports = {
    getAll,
    getSingle
};