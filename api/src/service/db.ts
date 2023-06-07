import { DataSource } from 'typeorm';
import {connectionOptions} from "../typeorm-config";

async function connectToDatabase(): Promise<DataSource> {
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

    const dataSource: DataSource = new DataSource(connectionOptions);
    await dataSource.initialize();
    console.log('Connected to PostgreSQL');
    return dataSource;
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}
export default connectToDatabase;
