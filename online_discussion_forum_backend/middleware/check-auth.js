const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('this is check auth ')
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(
        token,
        process.env.JWT_KEY,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.email;
            req.roles = decoded.roles;
            req.userId = decoded.userId;
            console.log('this is ma req user id',req.userId)
            next();
        }
    );

}