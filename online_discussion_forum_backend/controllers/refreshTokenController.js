const User = require('../models/users');
const jwt = require('jsonwebtoken');

exports.handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    
    if (!foundUser) {
        return res.sendStatus(403); 
    }
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_JWT_KEY,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "email": decoded.email,
                    "userId": decoded.userId
                },
                process.env.JWT_KEY,
                { expiresIn: '2d' }
            );
            res.json({ accessToken })
        }
    );
}