import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import Response from '../response';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { rejects } from 'assert';
const router = express();

var signup = async (req: any, res: any, next: any) => {
    var response = new Response();
    try {
        const hash = await new Promise((resolve, reject) => {
            bcrypt.hash(req.body.password, Number(process.env.HASH_SALT), (error, hash) => {
                if (error) {
                    reject("Something Went Wrong");
                }
                else
                    resolve(hash);
            });
        });
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
        });
        var foundUser: any = await User.find({ email: req.body.email }).exec();
        if (foundUser.length === 0) {
            await user.save();
            response.message.push("User Created");
            res.status(201);
        }
        else {
            response.message.push("User already exists");
            res.status(500);
        }
    } catch (error) {
        response.error.push(error);
        res.status(500);
    }
    finally {
        res.json(response);
    }
}

var signin = async (req: any, res: any, next: any) => {
    let response = new Response();
    try {
        const user: any = await User.findOne({ email: req.body.email }).exec()
        if (user) {
            let passwordHash = user.password;
            const match = await bcrypt.compare(req.body.password, passwordHash)
            if (match) {
                var key: string = String(process.env.SECRET_KEY);
                response.token = jwt.sign({ email: user.email, userId: String(user._id) }, key, { expiresIn: '1h', jwtid: String(user._id) });
                response.message.push('User Authenticated');
                res.status(200);
            }
            else {
                response.message.push("User Unauthenticated");
                res.status(409);
            }
        }
        else {
            response.message.push("User Not Available, Please Sign Up")
            res.status(500);
        }
    } catch (error) {
        response.message.push("Internal Server Error")
        res.status(500);
    }
    finally {
        res.json(response);
    }
}

export default { signup, signin }
