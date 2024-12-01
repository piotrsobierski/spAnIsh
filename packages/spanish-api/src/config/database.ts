import { DataSource } from "typeorm";
import { Category } from "../entities/Category";
import { Word } from "../entities/Word";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, //auto sync db schema
  dropSchema: false,
  logging: ["error"], // Only log errors
  entities: [Category, Word],
  migrations: [__dirname + "/../migrations/*.ts"],
  subscribers: [],
});

export default AppDataSource;
