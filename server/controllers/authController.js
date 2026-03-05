const AuthUser = require('../models/AuthUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//General JWT Token
const generalToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//Sign Up
const signup = async (req, res) => {
    const {name, email, password, role} = req.body;
    try{
        //Check if user already exists
        const existingUser = await AuthUser.findOne({ email});
        if(existingUser){
            return res.status(400).json({message: 'Email already registered'});
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create User
        const user = await AuthUser.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        //Return token
        const token = generalToken(user._id, user.role);
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role}
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

//Login
const login = async (req, res) => {
    const {email, password } = req.body;
    try{
        //Check if user exists
        const user = await AuthUser.findOne({email});
        if(!user){
            return res.status(401).json({
                message: 'Invalid email or password'
            });
                }
            //Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }
            //Return token
            const token = generalToken(user._id, user.role);
            res.status(200).json({
                message: 'Login Successful',
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role} 
            });
        }catch (err){
        res.status(500).json({message: err.message});
    }
};

//Get logged in user profile
const getProfile = async (req, res) => {
    try{
        const user = await AuthUser.findById(req.user.id).select('-password');
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
module.exports = {signup, login, getProfile};