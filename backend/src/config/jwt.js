const jwt = require('jsonwebtoken');

module.exports = (requiredRole = null) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).send({ error: 'Token não encontrado' });
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            
            const decoded = jwt.verify(token, process.env.JWT_TOKEN);
            req.user = decoded;


            if (requiredRole && req.user.role !== requiredRole) {
                return res.status(403).send({ error: 'Acesso negado: permissão insuficiente' });
            }

            next();
        } catch (err) {
            return res.status(401).send({ error: 'Token inválido' });
        }
    }
};
