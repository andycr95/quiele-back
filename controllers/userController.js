const userCtrl = {}
const User = require('../models/user')
const jwt = require('jsonwebtoken')

userCtrl.signIn = async (req, res) => {
    const { password, email } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        res.status(400).json({
            auth: false,
            message: 'Not user found'
        });
    } else {
        // Match password´s user
        const match = await user.matchPassword(password);
        if(match) {
            const token = jwt.sign({id: user._id}, 'shhhhh');
            const us = {
                _id: user._id,
                name: user.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
                email: user.email
            }
            res.status(200).json({
                auth: true,
                message: 'User logged',
                user: us,
                token
            });
        } else {
            res.status(400).json({
                auth: false,
                message: 'Incorrect password'
            });
        }
    }
};

userCtrl.currentUser = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    } 
    const decoded = await jwt.verify(token, 'shhhhh');
    const user = await User.findById(decoded.id);
    if (!user) {
        res.status(400).json({
            auth: false,
            message: 'Not user found'
        });
    } else {
        const okUs = {
            _id: user._id,
            name: user.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
            email: user.email,
        }
        res.status(200).json({
            auth: true,
            token,
            user: okUs
        });
    }
};

userCtrl.createUser = async (req, res, next) => {
    const { body: user } = req
    const email = await User.findOne({email: user.email});
    if (email) res.status(409).json({error: 'Bad Request', statusCode: 409, message: 'This email is already in use.', });
    else{
        try {
            const us = new User({
                name : user.name,
                email : user.email,
                password : user.password, 
                phoneNumber : user.phoneNumber, 
            });
            us.password = await us.encriptPassword(user.password);
            const resUs = await us.save();
            const okUs = {
                _id: resUs._id,
                name: resUs.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
                email: resUs.email,
                phoneNumber : resUs.phoneNumber, 
            }
            const token = jwt.sign({id: resUs._id}, 'shhhhh');
            res.status(201).json({
                message: 'User created',
                user: okUs,
                token
            });
        } catch (error) {
            next(error);
        }
    }
}

userCtrl.updateUser = async (req, res) => {
    const { id } = req.params
    const category = {
        name: req.body.name
    }
    await Category.findByIdAndUpdate(id, { $set: category }, { new: true })
    res.json({
        status: 'Categoria actualizada'
    })
}

userCtrl.deleteUser = async (req, res) => {
    await Category.findByIdAndRemove(req.params.id)
    res.json({
        status: 'Categoria eliminada'
    })
}

module.exports = userCtrl