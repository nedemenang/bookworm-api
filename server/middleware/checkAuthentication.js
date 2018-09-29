import { verify } from 'jsonwebtoken';

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        
        const decoded = verify(token, process.env.SECRET_KEY);
        console.log(token)
        req.userData = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed'
        });
    }
};