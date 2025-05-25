const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('DTproject').find();
    result.toArray().then((albums) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(albums);
    });
};

const getSingleByTitle = async (req, res) => {
    try {
        const albumTitleParam = decodeURIComponent(req.params.albumTitle);
        const result = await mongodb.getDatabase().db().collection('DTproject').find({title: { $regex: new RegExp(albumTitleParam, 'i')}});
        const albums = await result.toArray();

        if (albums.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(albums[0]);
        } else {
            res.status(400).json({message: 'Album not found.'});
        }
    } catch (error) {
        console.error('Error to find album by title: ', error);
        res.status(500).json({ message: error.message || 'Error on server to find the album.'});
    }
};

module.exports = {
    getAll,
    getSingleByTitle
};