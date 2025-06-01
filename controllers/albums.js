const mongodb = require('../data/database');
const Album = require('../models/album');
//const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const albums = await Album.find({}).populate('members', 'name role');
        res.status(200).json(albums);
    } catch (error) {
        console.error('Error to find all the albums:', error);
        res.status(500).json({ message: 'Error on server.' });
    }
};

const getSingleByTitle = async (req, res) => {
    try {
        const albumTitleParam = decodeURIComponent(req.params.albumTitle);
        const album = await Album.findOne({ title: { $regex: new RegExp(albumTitleParam, 'i') } }).populate('members', 'name role');
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
    const { title, releaseYear, type, tracklist, totalDuration, members} = req.body;

    if (!title || !releaseYear || !tracklist || !Array.isArray(tracklist)) {
        return res.status(400).json({ message: 'Title, releaseYear, and tracklist are required, and tracklist must be an array.'});
    }
    if (typeof releaseYear !== 'number' || releaseYear < 1989) {
        return res.status(400).json({ message: 'Release year must be a number and not less than 1989.'})
    }

    const album = new Album ({
        title,
        releaseYear,
        type,
        tracklist,
        totalDuration,
        members
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
    const { title, releaseYear, type, tracklist, totalDuration, members } = req.body;

    if (title === undefined || releaseYear === undefined || tracklist === undefined) {
        return res.status(400).json({ message: 'Title, releaseYear, and tracklist are required for update.' });
     }
    if (typeof releaseYear !== 'number' || releaseYear < 1989) {
        return res.status(400).json({ message: 'Release year must be a number and not less than 1989.' });
     }
    if (!Array.isArray(tracklist)) {
        return res.status(400).json({ message: 'Tracklist must be an array.' });
    }

    const albumData = {
        title,
        releaseYear,
        type,
        tracklist,
        totalDuration,
        coverArtUrl,
        description,
        members
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
            message: error.message || 'Error updating the album.'
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