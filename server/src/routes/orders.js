const { Order, orderValidationSchema, orderStatus } = require('../models/Order');

module.exports = function(fastify, opts, done) {
  
  fastify.register(function(fastify, opts, done) {
    fastify.get('/ws', { websocket: true }, (connection, req) => {
      const orderStream = Order.watch();
      orderStream.on('change', (change) => {
        connection.socket.send(JSON.stringify(change));
      });
    });
    done();
  });

 
  fastify.post('/', {
    preHandler: [fastify.verifyJWT],
    handler: async (request, reply) => {
      try {
        const validatedData = orderValidationSchema.parse(request.body);
        const order = new Order({
          ...validatedData,
          customerId: request.user.id,
          status: 'PENDING'
        });
        await order.save();
        
       
        
        reply.code(201).send(order);
      } catch (error) {
        reply.code(400).send({ error: error.message });
      }
    }
  });


  fastify.get('/', {
    preHandler: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async (request, reply) => {
      const orders = await Order.find().populate('customerId').populate('items.productId');
      reply.send(orders);
    }
  });


  fastify.get('/:id', {
    preHandler: [fastify.verifyJWT],
    handler: async (request, reply) => {
      const order = await Order.findById(request.params.id)
        .populate('customerId')
        .populate('items.productId');
      
      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }
      
    
      if (request.user.role !== 'admin' && order.customerId._id.toString() !== request.user.id) {
        return reply.code(403).send({ error: 'Unauthorized' });
      }
      
      reply.send(order);
    }
  });

 
  fastify.put('/:id/status', {
    preHandler: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async (request, reply) => {
      const { status } = request.body;
      if (!orderStatus.includes(status)) {
        return reply.code(400).send({ error: 'Invalid status' });
      }
      
      const order = await Order.findByIdAndUpdate(
        request.params.id,
        { status },
        { new: true }
      );
      
      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }
      
      reply.send(order);
    }
  });


  fastify.put('/:id/payment', {
    preHandler: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async (request, reply) => {
      const { paymentStatus } = request.body;
      if (typeof paymentStatus !== 'boolean') {
        return reply.code(400).send({ error: 'Invalid payment status' });
      }
      
      const order = await Order.findByIdAndUpdate(
        request.params.id,
        { paymentStatus },
        { new: true }
      );
      
      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }
      
      reply.send(order);
    }
  });

  done();
};