import express from 'express';
import User from '../controllers/user'
const router = express();

router.post('/signup', User.signup);

router.post('/signin', User.signin);

export default router;
