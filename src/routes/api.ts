import express from 'express';
import {register} from "../controllers/auth/register.js";
import {login} from "../controllers/auth/login.js";
import {forgotPassword} from "../controllers/auth/forgot-password.js";
import {auth} from "../controllers/auth/auth.js";
import {authenticate} from "../middleware/authenticate.js";

const authRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response Message
 *         errors:
 *           type: object
 *           description: Errors of input fields
 *         data:
 *           type: object
 *           description: Returned data
 *         code:
 *           type: number
 *           description: Response code
 *     Register:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the account
 *       example:
 *         username: rezashams
 *         email: rezashams.work@gmail.com
 *         password: 123abc
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the account
 *       example:
 *         email: rezashams.work@gmail.com
 *         password: 123abc
 *     ForgotPassword:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *       example:
 *         email: rezashams.work@gmail.com
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication in the service
 * /api/auth/register:
 *   post:
 *     summary: Register as new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         message: Register successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         message: Fields Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         message: Server Error
 * /api/auth/login:
 *   post:
 *     summary: Login to account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         message: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         message: Fields Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         message: Server Error
 * /api/auth:
 *   get:
 *     summary: Authenticate with tokens
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         message: Auth successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         message: Unauthorized
 *       500:
 *         message: Server Error
 * /api/auth/forgot-password:
 *   post:
 *     summary: Get reset password link of account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         message: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         message: Fields Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         message: Server Error
 */

authRouter.get('/auth', authenticate, auth);
authRouter.post('/auth/register', register);
authRouter.post('/auth/login', login);
authRouter.post('/auth/forgot-password', forgotPassword);

export default authRouter
