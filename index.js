require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

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
app.post('/animales', async (req, res) => {
  const nuevo = new Animal(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('🚀 Servidor backend corriendo en http://localhost:3000');
});
