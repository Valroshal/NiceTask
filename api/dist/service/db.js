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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../typeorm-config");
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const connectionOptions: DataSourceOptions = {
            //   type: 'postgres',
            //   host: 'abul.db.elephantsql.com',
            //   port: 5432,
            //   username: 'elddwomh',
            //   password: 'skgUevkZBiCtyZndoLUMgKK_NPDC90aD',
            //   database: 'elddwomh',
            //   synchronize: true,
            //   logging: true,
            //   entities: [User],
            // };
            const dataSource = new typeorm_1.DataSource(typeorm_config_1.connectionOptions);
            yield dataSource.initialize();
            console.log('Connected to PostgreSQL');
            return dataSource;
        }
        catch (error) {
            console.error('Error connecting to the database', error);
            throw error;
        }
    });
}
exports.default = connectToDatabase;
