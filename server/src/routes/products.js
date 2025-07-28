const fastify = require('fastify');
const { Product } = require('../models/Product');
const { verifyToken, verifyAdmin } = require('../utils/auth');

module.exports = async function(fastify, opts) {

  fastify.get('/', {
    handler: async (request, reply) => {
      const products = await Product.find();
      reply.send(products);
    }
  });

 
  fastify.post('/', {
    preHandler: [verifyToken, verifyAdmin],
    handler: async (request, reply) => {
      try {
        const product = new Product(request.body);
        await product.save();
        reply.code(201).send(product);
      } catch (error) {
        reply.code(400).send({ error: error.message });
      }
    }
  });

 
};