const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send({ error: 'Token não encontrado' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN); 
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ error: 'Token inválido' });
  }
};
