import express from 'express';
import mongoose from 'mongoose';
import Orders from '../models/order';
import Products from '../models/product';
import Response from '../response';
import checkAuth from '../middleware/jwt';

const app = express.Router();

app.get('/', checkAuth, (req, res, next) => {
    var response = new Response();
    Orders
        .find()
        .select("_id product quantity")
        .populate('product', 'name price _id')
        .exec()
        .then(result => {
            if (!result)
                response.message.push("No Orders Found")
            else {
                response.result.push({ count: result.length });
                response.result.push(result);
            }
            res.status(200).json(response)

        })
        .catch(error => {
            response.error.push(error);
            res.status(500).json(error)
        })
})

app.post('/', checkAuth, (req, res, next) => {
    var response = new Response();
    Products
        .findById(req.body.productId)
        .select("_id product quantity")
        .exec()
        .then(product => {
            if (product) {
                const order = new Orders({
                    _id: mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    quantity: req.body.quantity
                });
                order.save()
                    .then(result => {
                        response.result.push(result);
                        res.status(200).json(response)
                    }).catch(error => {
                        response.error.push(error);
                        res.status(500).json(response)
                    })
            }
            else {
                response.message.push("Object not found");
                return res.status(500).json(response)
            }
        }).catch(error => {
            response.error.push(error);
            res.status(500).json(response)
        })
});


app.get('/:id', checkAuth, (req, res, next) => {
    var response = new Response();
    Orders.findById(req.params.id)
        .populate('product', 'name price _id')
        .select('_id product quantity')
        .exec()
        .then(result => {
            if (result != null) {
                response.result.push(result);
                res.status(404).json(response)
            }
            else {
                response.message.push("Object not found")
                res.status(404).json(response)
            }
        }).catch(error => {
            response.error.push(error);
            res.status(500).json(response)
        })
});
app.delete('/:id', checkAuth, (req, res, next) => {
    var response = new Response();
    Orders.findByIdAndRemove(req.params.id)
        .select("_id product quantity")
        .exec()
        .then(result => {
            response.result.push(result);
            response.message.push("Order Deleted");
            res.status(200).json(response)
        })
        .catch(error => {
            response.error.push(error);
            res.status(200).json(response)
        })
})

export default app;
