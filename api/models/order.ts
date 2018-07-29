import mongoose from 'mongoose';
import Product from './product'

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});

export default mongoose.model('Order', orderSchema);
