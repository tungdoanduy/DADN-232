import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
require('dotenv').config();
import { validateEmail, validatePassword } from '@fe/utils';
import User from 'backend/models/user'; // Assuming "User" is exported directly from the user model
import UserToken from 'backend/models/userToken';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = async (user) => {
    try {
        if (!user || !user.email) {
            throw new Error('User email is required');
        }
        console.log(process.env.ACCESS_JWT_SECRET);
        console.log(process.env.REFRESH_JWT_SECRET);
        const payload = { email: user.email };
        const accessToken = jwt.sign(payload, process.env.ACCESS_JWT_SECRET, { expiresIn: '14m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, { expiresIn: '30d' });

        const userToken = await UserToken.findOne({ email: user.email });
        if (userToken) await userToken.remove();

        await new UserToken({ email: user.email, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

const login = async (req: Request, res: Response) => {
    try {
        // base64 decode the data: email, password
        const { email, password } = req.body;
        if (!validateEmail(email) && !validatePassword(password)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'error',
                message: 'The email or password invalid.'
            });
        }
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'error',
                message: 'Request missing email or password'
            });
        }
        // Assuming the username is in req.body.name
        const user = await User.findOne({ email: email }); // Using findOne instead of findALL and awaiting the result
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' });
        }
        // console.log(user);
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Password incorrect' });
        }
        // Assuming you have user ID in the user object, adjust this accordingly based on your schema
        // const { email } = user;

        // Generate token
        const token = await generateToken(user);
        // req.session.token = token;
        // Send token in response
        return res.status(StatusCodes.OK).json({ accessToken: token.accessToken, refreshToken: token.refreshToken });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export { generateToken, login };
