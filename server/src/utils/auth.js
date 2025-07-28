const jwt = require('jsonwebtoken');


const verifyToken = async (request, reply) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    request.user = decoded;
  } catch (error) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
};

const verifyAdmin = async (request, reply) => {
  if (request.user.role !== 'admin') {
    reply.code(403).send({ error: 'Forbidden' });
  }
};

module.exports = { verifyToken, verifyAdmin };