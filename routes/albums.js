const express = require('express');
const router = express.Router();

const albumsController = require('../controllers/albums');

const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', albumsController.getAll);

router.get('/:albumTitle', albumsController.getSingleByTitle);

router.post('/', isAuthenticated, albumsController.createAlbum);

router.put('/:id', isAuthenticated, albumsController.updateAlbum);

router.delete('/:id', isAuthenticated, albumsController.deleteAlbum);

module.exports = router;