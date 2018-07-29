import jwt from 'jsonwebtoken';
import Response from '../response'

var valid = (req: any, res: any, next: any) => {
    var response = new Response();
    try {
        var token: any = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, String(process.env.SECRET_KEY));
        req.userData = decoded;
        next();
    }
    catch (error) {
        response.message.push("Unauthorized");
        res.status(500).json(response);
    }
}

export default valid;
