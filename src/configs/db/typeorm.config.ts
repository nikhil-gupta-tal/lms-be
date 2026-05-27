import "dotenv/config";
import { DataSource } from "typeorm";

export const typeormConnectionOptions = {
  type: "postgres" as const,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
};

const AppDataSource = new DataSource({
  ...typeormConnectionOptions,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/configs/db/migrations/*.js"],
  logging: true,
});

export default AppDataSource;
