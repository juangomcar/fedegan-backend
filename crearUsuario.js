const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');

mongoose.connect('mongodb+srv://jfgomez4224:CSC7uefpFm81b6Ak@cluster42.ku93b5j.mongodb.net/fedegan?retryWrites=true&w=majority').then(async () => {
  const hash = await bcrypt.hash('admin123', 10);

  await Usuario.create({
    correo: 'admin@fedegan.com',
    contraseña: hash,
    rol: 'admin'
  });

  console.log('✅ Usuario creado');
  process.exit();
});
