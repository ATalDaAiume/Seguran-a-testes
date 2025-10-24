const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ error: 'aaaaaaaaaaToken não fornecido' });
    }

    try {
        const pureToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(pureToken, JWT_SECRET_KEY);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Token inválido' });
    }
}

module.exports = authMiddleware;