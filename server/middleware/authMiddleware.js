const AuthUser = require('../models/AuthUser');
const jwt = require('jsonwebtoken');

//Protect route - verify token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //Get token from header
            token = req.headers.authorization.split(' ')[1];

            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Attach user to request
            req.user = await AuthUser.findById(decoded.id).select('-password');
            next();
        }catch (err){
            return res.status(401).json({ message: 'Not authorized, token failed'});
        }
    }
    if(!token){
        return res.status(401).json({message: 'Not authorized, no token'});
    }
};

//Admin only middleware
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    } else{
        res.status(403).json({
            message: 'Access denied. Admins only'
        });
    }
};

module.exports = {protect, adminOnly};