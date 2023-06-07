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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// Connect to the PostgreSQL database
const db_1 = __importDefault(require("./service/db"));
const userController_1 = require("./controller/userController");
const weatherController_1 = require("./controller/weatherController");
// Load environment variables
(0, dotenv_1.config)();
// Environment variables
const { API_PORT, PORT } = process.env;
const port = Number(PORT) || Number(API_PORT) || 8000;
// Create Express app
const app = (0, express_1.default)();
// Use body-parser middleware to parse request bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Enable CORS
app.use((0, cors_1.default)());
// Connect to the PostgreSQL database
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)();
            // Additional server setup and start code
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
        catch (error) {
            console.error('Error connecting to the database', error);
        }
    });
}
startServer();
// Routes
// Register user
app.post('/register', userController_1.register);
// Login
app.post('/login', userController_1.login);
// validate token
app.get('/validate_token', userController_1.validateToken, (req, res) => {
    res.json({ message: 'Access granted' });
});
//get weather
app.post('/get_weather', weatherController_1.getWeather);
// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
