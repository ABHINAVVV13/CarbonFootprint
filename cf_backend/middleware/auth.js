const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
    if (!idToken) {
        return res.status(403).send('No token provided');
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Add this line for debugging
        return res.status(403).send('Unauthorized');
    }
};

module.exports = verifyToken;
