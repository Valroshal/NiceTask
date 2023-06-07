import {DataSourceOptions} from "typeorm";
import {User} from "../dist/model/userModel";

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'abul.db.elephantsql.com',
  port: 5432,
  username: 'elddwomh',
  password: 'skgUevkZBiCtyZndoLUMgKK_NPDC90aD',
  database: 'elddwomh',
  synchronize: true,
  logging: true,
  entities: [User],
};
