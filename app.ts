import express from 'express';
import cors from 'cors';
import ordersRoutes from './api/routes/orders';
import productRoutes from './api/routes/products';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
const mongodbURL: string = 'mongodb+srv://' + process.env.MONGO_ID + ':' + process.env.MONGO_PASSWORD + '@testcluster-trljw.mongodb.net/test?retryWrites=true'
const app = express();

//MongoDB Setup with Mongoose
mongoose.connect(mongodbURL, { useNewUrlParser: true });

//Body Parser Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Cross Origin Middleware
app.use(cors());

//Static Files
app.use('/uploads', express.static('uploads'))

//Logging Middleware
app.use(morgan('dev'))

//Router Middlewares
app.use('/orders', ordersRoutes);
app.use('/products', productRoutes);

//Error Middlewares
app.use((req, res, next) => {
    let error: any = new Error('Not Found');
    error.status = 404;
    next(error)
});

app.use((error: any, req: any, res: any, next: any) => {
    res.status(error.status || 500);
    res.json({
        origin: 'app',
        error: {
            message: error.message
        }
    })
});

export default app;