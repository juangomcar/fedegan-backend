require('dotenv').config(); // Para leer variables de entorno
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');

// Conexión segura desde .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Conectado a MongoDB');

  const existente = await Usuario.findOne({ correo: 'admin@fedegan.com' });

  if (existente) {
    console.log('⚠️ El usuario admin@fedegan.com ya existe');
  } else {
    const hash = await bcrypt.hash('admin123', 10);
    await Usuario.create({
      correo: 'admin@fedegan.com',
      contraseña: hash,
      rol: 'admin'
    });
    console.log('✅ Usuario creado con éxito');
  }

  mongoose.disconnect();
}).catch((err) => {
  console.error('❌ Error de conexión:', err);
});
