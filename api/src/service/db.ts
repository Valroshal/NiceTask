import { DataSource } from 'typeorm';
import {connectionOptions} from "../typeorm-config";

async function connectToDatabase(): Promise<DataSource> {
  try {
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
