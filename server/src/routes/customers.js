const { Customer } = require('../models/Customer');
const { verifyToken, verifyAdmin } = require('../utils/auth');

module.exports = function(fastify, opts, done) {
 
  fastify.get('/', {
    preHandler: [verifyToken, verifyAdmin],
    handler: async (request, reply) => {
      const customers = await Customer.find();
      reply.send(customers);
    }
  });


  
  done();
};