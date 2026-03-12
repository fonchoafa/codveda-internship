const AuthUser = require('../../models/AuthUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Query, Error } = require('mongoose');

const generateToken = (id, role) => {
return jwt.sign({id, role}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
});
};

const userResolvers = {
    Query:{
        // Get all Users
        getUsers: async(_, __, context) => {
            if(!context.user) throw new Error('Not authorized');
            const users = await AuthUser.find(). select('-password');
            return user.map(u => ({ ...u._doc, id: u._id}));
        },
        //Get user by ID
        getUserById: async(_, {id}, context) => {
            if(!context.user) throw new Error('Not authorized');
            const user = await AuthUser.findById(context.user.id).select('-password');
            return {...user._doc, id: user._id };

        }

    },

    Mutation: {
        //SignUp
        signup: async (_, {name, email, password}) => {
            const existingUser = await AuthUser.findOne({email});
            if(existingUser) throw new Error ('Email already registered');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await AuthUser.create({
                name,
                email,
                password: hashedPassword
            });

            const token = generateToken(user._id, user.role);
            return {
                token,
                message: 'User registered successfully',
                user: {...user._doc, id: user._id}
            };
        },
        //Login
        login: async(_, {email, password}) => {
            const user = await AuthUser.findOne({ email})
            if(!user) throw new Error ('Invalid email or password');

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) throw new Error('Invalid email or password');

            const token = generateToken(user._id, user.role);
            return {
                token,
                message: 'Login successful',
                user: { ...user._doc, id: user._id }
            };
        }
    }
};

module.exports = userResolvers;