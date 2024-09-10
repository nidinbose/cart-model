import jwt from 'jsonwebtoken';

export function Auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: 'No authorization token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'JWT must be provided' });
        }

        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
       
    } catch (error) {
        console.error(error);
        return res.status(401).json({ msg: 'Unauthorized access - Invalid token.' });
    }
}
