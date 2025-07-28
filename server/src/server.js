const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');


const registerPlugins = async (fastify) => {
  await fastify.register(require('@fastify/cors'), { 
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });
  
  await fastify.register(require('@fastify/websocket'));
  await fastify.register(require('@fastify/rate-limit'), { 
    max: 100, 
    timeWindow: '1 minute' 
  });
  await fastify.register(require('@fastify/helmet'));
  
  
  await fastify.register(require('@fastify/jwt'), { 
    secret: process.env.JWT_SECRET || 'your-secret-key' 
  });
  

  fastify.decorate('verifyJWT', async (request, reply) => {
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      
      const decoded = await fastify.jwt.verify(token);
      request.user = decoded;
    } catch (error) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
  
  fastify.decorate('verifyAdmin', async (request, reply) => {
    if (request.user?.role !== 'admin') {
      reply.code(403).send({ error: 'Forbidden' });
    }
  });
};


const registerRoutes = async (fastify) => {
  await fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
  await fastify.register(require('./routes/orders'), { prefix: '/api/orders' });
  await fastify.register(require('./routes/products'), { prefix: '/api/products' });
  await fastify.register(require('./routes/customers'), { prefix: '/api/customers' });
  await fastify.register(require('./routes/admin'), { prefix: '/api/admin' });
};


const start = async () => {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oms');
    fastify.log.info('MongoDB connected');
    
   
    await registerPlugins(fastify);
    await registerRoutes(fastify);
    
   
    fastify.get('/healthz', async (request, reply) => {
      return { status: 'ok' };
    });
    
  
    await fastify.listen({ 
      port: process.env.PORT || 3000, 
      host: '0.0.0.0' 
    });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();