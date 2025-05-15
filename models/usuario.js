const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'tecnico', 'vacunador'], required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
