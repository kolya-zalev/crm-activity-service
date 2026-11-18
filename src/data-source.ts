import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ActivityEntity } from './activity.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.ACTIVITY_DATABASE_URL,
  entities: [ActivityEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
