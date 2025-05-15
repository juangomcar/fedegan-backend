const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto123'); // Usa tu clave real si usas .env
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
}

function soloRol(rolEsperado) {
  return (req, res, next) => {
    if (req.usuario?.rol !== rolEsperado) {
      return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol ' + rolEsperado });
    }
    next();
  };
}

module.exports = { verificarToken, soloRol };
