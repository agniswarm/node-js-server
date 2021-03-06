import express from 'express';
import Product from '../models/product'
import mongoose from "mongoose";
import Response from '../response'
import multer from '../middleware/multer';
import checkAuth from '../middleware/jwt';

const app = express.Router()

app.get('/', (req, res, next) => {
    var response = new Response();
    Product
        .find()
        .select('_id name price productImage')
        .exec()
        .then(result => {
            if (result.length > 0) {
                response.result.push({ count: result.length })
                response.result.push(result)
            }
            else
                response.message.push("The product list is empty")
            res.status(200)
                .json(response)
        }).catch(error => {
            response.error.push(error.message);
            res.status(500)
                .json(response)
        });
});

app.post('/', checkAuth, multer.single('productImage'), (req, res, next) => {
    console.log(req.body, req.file);
    var response = new Response();
    let product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            response.result.push(result);
            response.message.push("Product Added");
            res.status(201)
                .json(response)

        }).catch(error => {
            response.error.push(error.message)
            res.status(500)
                .json(response)
        });
});

app.get('/:id', (req, res, next) => {
    var response = new Response();
    let id: string = req.params.id;
    Product.findById(id)
        .select('_id name price')
        .exec()
        .then(
            result => {
                if (result)
                    response.result.push(result);
                else
                    response.message.push("The product does not exist")
                res.status(200)
                    .json(response)
            }
        ).catch(
            error => {
                response.error.push(error.message)
                res.status(500)
                    .json(response)
            }
        )

});
app.patch('/:id', checkAuth, (req, res, next) => {
    var response = new Response();
    let id = req.params.id;
    Product.findByIdAndUpdate(id, req.body)
        .select('_id name price productImage')
        .exec()
        .then(result => {
            response.message.push("Product Updated");
            res.status(200)
                .json(response)
        })
        .catch(error => {
            response.error.push(error.message);
            res.status(500)
                .json(response)
        })
});

app.delete('/:id', checkAuth, (req, res, next) => {
    var response = new Response();
    let id = req.params.id;
    Product.findByIdAndRemove(id)
        .select('_id name price productImage')
        .exec()
        .then(
            result => {
                response.result.push(result);
                response.message.push("Product Deleted")
                res.status(200)
                    .json(response)
            }
        )
        .catch(
            error => {
                response.error.push(error.message);
                res.status(500)
                    .json(response)
            }
        )
});


export default app;
