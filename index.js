require('dotenv').config();
const { verificarToken, soloRol } = require('./middlewares/auth');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Modelo Animal
const Animal = mongoose.model('Animal', {
  nombre: String,
  finca: String,
  vacunado: Boolean
});

// 🟢 Ruta para login
app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  const usuario = await Usuario.findOne({ correo });
  if (!usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

  const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!esValida) return res.status(403).json({ mensaje: 'Contraseña incorrecta' });

  const token = jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    'secreto123', // Idealmente en .env como TOKEN_SECRET
    { expiresIn: '2h' }
  );

  res.json({ token });
});

// 🔐 Ruta protegida: obtener animales (solo token válido)
app.get('/animales', verificarToken, async (req, res) => {
  const animales = await Animal.find();
  res.json(animales);
});

// 🔐 Ruta protegida: crear animal (solo rol admin)
app.post('/animales', verificarToken, soloRol('admin'), async (req, res) => {
  const nuevo = new Animal(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// 🧪 Ruta temporal para crear usuarios en MongoDB Atlas
app.get('/crear-usuarios', async (req, res) => {
  const usuarios = [
    {
      correo: 'admin@fedegan.com',
      contraseña: 'admin123',
      rol: 'admin'
    },
    {
      correo: 'tecnico@fedegan.com',
      contraseña: 'tecnico123',
      rol: 'tecnico'
    },
    {
      correo: 'vacunador@fedegan.com',
      contraseña: 'vacunador123',
      rol: 'vacunador'
    }
  ];

  const resultados = [];

  for (const user of usuarios) {
    const existente = await Usuario.findOne({ correo: user.correo });

    if (existente) {
      resultados.push(`⚠️ ${user.correo} ya existe`);
    } else {
      const hash = await bcrypt.hash(user.contraseña, 10);
      await Usuario.create({
        correo: user.correo,
        contraseña: hash,
        rol: user.rol
      });
      resultados.push(`✅ ${user.correo} creado`);
    }
  }

  res.send(resultados.join('<br>'));
});

// 🏁 Ruta raíz
app.get('/', (req, res) => {
  res.send('✅ API de FEDEGÁN funcionando correctamente. Usa POST /login desde Postman.');
});

// Servidor
app.listen(3000, () => {
  console.log('🚀 Servidor backend corriendo en http://localhost:3000');
});
