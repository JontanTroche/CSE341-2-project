const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  trackNumber: {
    type: Number,
    required: true,
    min: 1 
  },
  trackTitle: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    match: /^\d{1,2}:\d{2}$/,
    required: true
  }
}, { _id: false }); 

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del álbum es requerido.'],
    trim: true 
  },
  releaseYear: {
    type: Number,
    required: [true, 'El año de lanzamiento es requerido.'],
    min: [1989, 'El año de lanzamiento no puede ser anterior a 1989 (primer álbum de DT).'], 
    max: [new Date().getFullYear() + 2, 'El año de lanzamiento no puede ser en el futuro lejano.'] 
  },
  type: {
    type: String,
    enum: ['Studio Album', 'Live Album', 'EP', 'Compilation', 'Single', 'Demo', 'Other'], 
    default: 'Studio Album'
  },
  tracklist: {
    type: [trackSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'La lista de pistas no puede estar vacía.' 
    }
  },
  totalDuration: {
    type: String,
    match: /^\d{1,3}:\d{2}$/
  },
  coverArtUrl: {
    type: String,
    match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'La descripción no puede exceder los 1000 caracteres.'], 
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);