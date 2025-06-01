const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Simplificado
    trim: true
  },
  role: {
    type: String,
    enum: ['Vocals', 'Guitar', 'Bass', 'Drums', 'Keyboards'],
    required: true // Simplificado
  },
  joinYear: {
    type: Number,
    required: true, // Simplificado
    min: [1985, 'El año de ingreso no puede ser anterior a 1985 (fundación de DT).']
  },
  leaveYear: {
    type: String, // Cambiamos a String para aceptar "Continues"
    validate: {
      validator: function(v) {
        return v === 'Continues' || (Number(v) >= this.joinYear);
      },
      message: 'El año de salida debe ser "Continues" o un año mayor o igual al año de ingreso.'
    }
  },
  reunionYear: {
    type: Number,
    min: [1985],
    validate: {
      validator: function(v) {
        return !v || (v > this.leaveYear && Number(this.leaveYear) !== NaN);
      },
      message: 'El año de reunión debe ser posterior al año de salida.'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);