const { verifyToken, verifyAdmin } = require('../utils/auth');

module.exports = function(fastify, opts, done) {
 
  fastify.get('/dashboard', {
    preHandler: [verifyToken, verifyAdmin],
    handler: async (request, reply) => {
    s
      reply.send({ message: 'Admin dashboard' });
    }
  });

 
  fastify.get('/orders/export', {
    preHandler: [verifyToken, verifyAdmin],
    handler: async (request, reply) => {
   
      reply.header('Content-Type', 'text/csv');
      reply.send('CSV data would be here');
    }
  });

  done();
};