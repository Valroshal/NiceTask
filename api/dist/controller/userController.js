"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = exports.validateToken = void 0;
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const userModel_1 = require("../model/userModel");
(0, dotenv_1.config)();
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const tokenKey = process.env.TOKEN_KEY || '';
let dataSource;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connectionOptions = {
                type: 'postgres',
                host: 'abul.db.elephantsql.com',
                port: 5432,
                username: 'elddwomh',
                password: 'skgUevkZBiCtyZndoLUMgKK_NPDC90aD',
                database: 'elddwomh',
                synchronize: true,
                logging: true,
                entities: [userModel_1.User],
            };
            dataSource = new typeorm_1.DataSource(connectionOptions);
            yield dataSource.initialize();
            console.log('Connected to PostgreSQL');
        }
        catch (error) {
            console.error('Error connecting to the database', error);
            throw error;
        }
    });
}
connectToDatabase();
const validateToken = (req, res, next) => {
    // Get the token from the request headers, query parameters, or cookies
    const token = req.headers.authorization || req.query.token || req.cookies.token;
    console.log('token', token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Verify the token
    const newToken = token;
    const slicedToken = newToken.slice(7);
    jwt.verify(slicedToken, tokenKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // If the token is valid, you can access the decoded data in `decoded` object
        //req.userId = decoded.user_id; TODO here is the bug in userId
        next();
    });
};
exports.validateToken = validateToken;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('login called');
    try {
        const { email, password } = req.body;
        console.log('req.body', req.body);
        if (!(email && password)) {
            return res.status(400).send('All inputs are required');
        }
        const userRepository = dataSource.getRepository(userModel_1.User);
        console.log('userRepository', userRepository);
        const user = yield userRepository.findOne({ where: { email } });
        console.log('user', user);
        if (user && (yield bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ user_id: user.id, email }, tokenKey, {
                expiresIn: '2h',
            });
            const returnedUser = {
                token: token,
                email: user.email,
                id: user.id,
                password: user.password,
            };
            return res.status(200).json(returnedUser);
        }
        return res.status(400).send('Invalid Credentials');
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send('All inputs are required');
        }
        console.log('before fetching user');
        const userRepository = dataSource.getRepository(userModel_1.User);
        console.log('after fetching user');
        const oldUser = yield userRepository.findOne({ where: { email } });
        if (oldUser) {
            console.log('oldUser', oldUser);
            return res.status(409).send('User Already Exist. Please Login');
        }
        const encryptedPassword = yield bcrypt.hash(password, 10);
        console.log('encryptedPassword', encryptedPassword);
        const user = yield createUser(email.toLowerCase(), encryptedPassword);
        console.log('user', user);
        const token = jwt.sign({ user_id: user.id, email }, tokenKey, {
            expiresIn: '2h',
        });
        const returnedUser = {
            token: token,
            email: user.email,
            id: user.id,
            password: user.password,
        };
        console.log('returnedUser', returnedUser);
        return res.status(201).json(returnedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.register = register;
const createUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new userModel_1.User();
        user.email = email;
        user.password = password;
        const userRepository = dataSource.getRepository(userModel_1.User);
        yield userRepository.save(user);
        console.log('User created:', user);
        return user;
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
});
