"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = exports.validateToken = void 0;
var dotenv_1 = require("dotenv");
var typeorm_1 = require("typeorm");
var userModel_1 = require("../model/userModel.js");
(0, dotenv_1.config)();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var tokenKey = process.env.TOKEN_KEY;
var validateToken = function (req, res, next) {
    // Get the token from the request headers, query parameters, or cookies
    var token = req.headers.authorization || req.query.token || req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Verify the token
    var newToken = token;
    var slicedToken = newToken.slice(7);
    jwt.verify(slicedToken, tokenKey, function (err, decoded) {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // If the token is valid, you can access the decoded data in `decoded` object
        //req.userId = decoded.user_id; TODO here is the bug in userId
        next();
    });
};
exports.validateToken = validateToken;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, userRepository, user, _b, token, returnedUser, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!(email && password)) {
                    return [2 /*return*/, res.status(400).send('All inputs are required')];
                }
                userRepository = (0, typeorm_1.getRepository)(userModel_1.User);
                return [4 /*yield*/, userRepository.findOne({ where: { email: email } })];
            case 1:
                user = _c.sent();
                _b = user;
                if (!_b) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 2:
                _b = (_c.sent());
                _c.label = 3;
            case 3:
                if (_b) {
                    token = jwt.sign({ user_id: user.id, email: email }, tokenKey, {
                        expiresIn: '2h',
                    });
                    returnedUser = {
                        token: token,
                        email: user.email,
                        id: user.id,
                        password: user.password,
                    };
                    return [2 /*return*/, res.status(200).json(returnedUser)];
                }
                return [2 /*return*/, res.status(400).send('Invalid Credentials')];
            case 4:
                err_1 = _c.sent();
                console.log(err_1);
                return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, userRepository, oldUser, encryptedPassword, user, token, returnedUser, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Register endpoint called');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password;
                console.log('req.body', req.body);
                if (!(email && password)) {
                    return [2 /*return*/, res.status(400).send('All inputs are required')];
                }
                userRepository = (0, typeorm_1.getRepository)(userModel_1.User);
                return [4 /*yield*/, userRepository.findOne({ where: { email: email } })];
            case 2:
                oldUser = _b.sent();
                if (oldUser) {
                    console.log('oldUser', oldUser);
                    return [2 /*return*/, res.status(409).send('User Already Exist. Please Login')];
                }
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 3:
                encryptedPassword = _b.sent();
                console.log('encryptedPassword', encryptedPassword);
                return [4 /*yield*/, createUser(email.toLowerCase(), encryptedPassword)];
            case 4:
                user = _b.sent();
                console.log('user', user);
                token = jwt.sign({ user_id: user.id, email: email }, tokenKey, {
                    expiresIn: '2h',
                });
                returnedUser = {
                    token: token,
                    email: user.email,
                    id: user.id,
                    password: user.password,
                };
                console.log('returnedUser', returnedUser);
                return [2 /*return*/, res.status(201).json(returnedUser)];
            case 5:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var createUser = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userRepository, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = new userModel_1.User();
                user.email = email;
                user.password = password;
                userRepository = (0, typeorm_1.getRepository)(userModel_1.User);
                return [4 /*yield*/, userRepository.save(user)];
            case 1:
                _a.sent();
                console.log('User created:', user);
                return [2 /*return*/, user];
            case 2:
                error_1 = _a.sent();
                console.error('Error creating user:', error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
