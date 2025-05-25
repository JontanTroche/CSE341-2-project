const mongodb = require('../data/database');
const Album = require('../models/album');
//const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const albums = await Album.find({});
        res.status(200).json(albums);
    } catch (error) {
        console.error('Error to find all the albums:', error);
        res.status(500).json({ message: 'Error on server.' });
    }
};

const getSingleByTitle = async (req, res) => {
    try {
        const albumTitleParam = decodeURIComponent(req.params.albumTitle);
        const album = await Album.findOne({ title: { $regex: new RegExp(albumTitleParam, 'i') } });

        if (album) {
            res.status(200).json(album);
        } else {
            res.status(404).json({ message: 'Abumnot found.' });
        }
    } catch (error) {
        console.error('Error to find the album by title: ', error);
        res.status(500).json({ message: error.message || 'Error on server to find the album.' });
    }
};

const createAlbum = async (req, res) => {
    const album = new Album ({
        title: req.body.title,
        releaseYear: req.body.releaseYear,
        type: req.body.type,
        tracklist: req.body.tracklist,
        totalDuration: req.body.totalDuration,
        members: req.body.members
    });

    try {
        const savedAlbum = await album.save();
        res.status(201).json(savedAlbum);
    } catch (error) {
        console.error('Error to create the album: ', error);
        res.status(400).json({
            message: error.message || 'Error to create the album.'
        });
    }
};

const updateAlbum = async (req, res) => {
    const albumId = req.params.id;

    const albumData = {
        title: req.body.title,
        releaseYear: req.body.releaseYear,
        type: req.body.type,
        tracklist: req.body.tracklist,
        totalDuration: req.body.totalDuration,
        coverArtUrl: req.body.coverArtUrl,
        description: req.body.description,
        members: req.body.members
    };

    try {
        const updatedAlbum = await Album.findByIdAndUpdate(albumId, albumData, {
            new: true,
            runValidators: true
        });

        if (!updatedAlbum) {
            return res.status(404).json({ message: 'Not album finded.' });
        }

        res.status(200).json(updatedAlbum);
    } catch (error) {
        console.error('Error to update the album:', error);
        res.status(400).json({
            message: error.message || 'Errorupdating the album.'
        });
    }
};

const deleteAlbum = async (req, res) => {
    const albumId = req.params.id;

    try {
        const deletedAlbum = await Album.findByIdAndDelete(albumId);

        if (!deletedAlbum) {
            return res.status(404).json({ message: 'Album not find' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting the album:', error);
        res.status(500).json({ message: error.message || 'Error on server to see the album.' });
    }
};

module.exports = {
    getAll,
    getSingleByTitle,
    createAlbum,
    updateAlbum,
    deleteAlbum
};