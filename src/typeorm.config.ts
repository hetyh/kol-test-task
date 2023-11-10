import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 3306,
  username: process.env.POSTGRES_USER || 'postgres',
  database: process.env.POSTGRES_DB || 'test',
  password: process.env.POSTGRES_PASS || 'postgres',
  entities: [User, Book],
  // migrations: [path.join(__dirname, '..', 'src/migrations/*.{ts,js}')],
  synchronize: false,
  dropSchema: false,
  migrationsRun: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
