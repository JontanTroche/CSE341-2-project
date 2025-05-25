const express = require('express');
const router = express.Router();

const albumsController = require('../controllers/albums');

router.get('/', albumsController.getAll);

router.get('/:albumTitle', albumsController.getSingleByTitle);

router.post('/', albumsController.createAlbum);

router.put('/:id', albumsController.updateAlbum);

router.delete('/:id', albumsController.deleteAlbum);

module.exports = router;