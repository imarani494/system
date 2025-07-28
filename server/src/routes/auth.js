const { User } = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = function(fastify, opts, done) {
 
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['customer', 'admin'] }
        }
      }
    },
    handler: async (request, reply) => {
      try {
        const { name, email, password, role } = request.body;
        
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return reply.code(400).send({ error: 'Email already in use' });
        }
        
       
        const hashedPassword = await bcrypt.hash(password, 10);
        
       
        const user = new User({
          name,
          email,
          password: hashedPassword,
          role
        });
        
        await user.save();
        
        
        const token = fastify.jwt.sign(
          { id: user._id, role: user.role },
          { expiresIn: '1d' }
        );
        
        reply.code(201).send({ 
          user: { 
            id: user._id, 
            name, 
            email, 
            role 
          }, 
          token 
        });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    }
  });


  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    },
    handler: async (request, reply) => {
      try {
        const { email, password } = request.body;
        
        
        const user = await User.findOne({ email });
        if (!user) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }
        
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }
        
        
        const token = fastify.jwt.sign(
          { id: user._id, role: user.role },
          { expiresIn: '1d' }
        );
        
        reply.send({ 
          user: { 
            id: user._id, 
            name: user.name, 
            email, 
            role: user.role 
          }, 
          token 
        });
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    }
  });


  fastify.get('/me', {
    preHandler: [fastify.verifyJWT],
    handler: async (request, reply) => {
      try {
        const user = await User.findById(request.user.id).select('-password');
        if (!user) {
          return reply.code(404).send({ error: 'User not found' });
        }
        reply.send(user);
      } catch (error) {
        reply.code(500).send({ error: error.message });
      }
    }
  });

  done();
};