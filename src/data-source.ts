import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Category } from './categories/category.entity';
import { Show } from './shows/show.entity';
import { User } from './users/user.entity';
import { Setting } from './settings/setting.entity';
import { Banner } from './banners/banner.entity';
import { Client } from './clients/client.entity';
import { Backstage } from './backstage/backstage.entity';

config(); // load .env

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'khayal_alzili',
  entities: [Category, Show, User, Setting, Banner, Client, Backstage],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
