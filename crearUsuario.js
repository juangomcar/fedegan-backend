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

  for (const user of usuarios) {
    const existente = await Usuario.findOne({ correo: user.correo });

    if (existente) {
      console.log(`⚠️ El usuario ${user.correo} ya existe`);
    } else {
      const hash = await bcrypt.hash(user.contraseña, 10);
      await Usuario.create({
        correo: user.correo,
        contraseña: hash,
        rol: user.rol
      });
      console.log(`✅ Usuario ${user.correo} creado con éxito`);
    }
  }

  mongoose.disconnect();
}).catch((err) => {
  console.error('❌ Error de conexión:', err);
});
