import { DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { MainSeeder } from "../database/seeds/MainSeeder";

const baseConfig: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/../domain/entities/*.{ts,js}`],
  migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
  seeds: [MainSeeder],
};

export const databaseConfig = {
  development: {
    ...baseConfig,
    logging: false,
  },
  test: {
    ...baseConfig,
    logging: false,
  },
  production: {
    ...baseConfig,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export type NODE_ENV = "development" | "test" | "production";

export const getDatabaseConfig = (env: NODE_ENV) => databaseConfig[env];
