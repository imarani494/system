const mongoose = require('mongoose');
const { z } = require('zod');


const orderStatus = ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED'];

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: orderStatus, default: 'PENDING' },
  paymentStatus: { type: Boolean, default: false },
  shippingAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


const orderValidationSchema = z.object({
  customerId: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })).min(1),
  totalAmount: z.number().min(0),
  shippingAddress: z.string().min(1)
});

orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = {
  Order: mongoose.model('Order', orderSchema),
  orderValidationSchema,
  orderStatus
};