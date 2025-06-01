const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  releaseYear: {
    type: Number,
    required: true,
    min: [1989, 'El año de lanzamiento no puede ser anterior a 1989.']
  },
  type: {
    type: String,
    enum: ['Studio', 'Live', 'EP', 'Single'],
    default: 'Studio'
  },
  tracklist: {
    type: [String],
    required: true
  },
  totalDuration: {
    type: Number,
    min: 0
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);