require('dotenv').config();
const { verificarToken, soloRol } = require('./middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');

app.use(express.json());

// Ruta para login
app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  const usuario = await Usuario.findOne({ correo });
  if (!usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

  const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!esValida) return res.status(403).json({ mensaje: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    'secreto123', // luego lo pones en .env
    { expiresIn: '2h' }
  );

  res.json({ token });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Esquema y modelo
const Animal = mongoose.model('Animal', {
  nombre: String,
  finca: String,
  vacunado: Boolean
});

// Endpoint para obtener todos los animales
app.get('/animales', async (req, res) => {
  const animales = await Animal.find();
  res.json(animales);
});

// Endpoint para crear un nuevo animal
app.post('/animales', verificarToken, soloRol('admin'), async (req, res) => {
  const nuevo = new Animal(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// ✅ Ruta raíz para confirmar que está viva la API
app.get('/', (req, res) => {
  res.send('✅ API de FEDEGÁN funcionando correctamente. Usa POST /login desde Postman.');
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('🚀 Servidor backend corriendo en http://localhost:3000');
});
