"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionOptions = void 0;
const userModel_1 = require("../dist/model/userModel");
exports.connectionOptions = {
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
