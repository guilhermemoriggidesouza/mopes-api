import { config as configDotenv } from 'dotenv';
configDotenv();

export default {
  secret_key: process.env.SECRET_KEY,
  db_username: process.env.USER_DB_MOPE,
  db_host: process.env.HOST_DB_MOPE,
  db_password: process.env.PASSWORD_DB_MOPE,
  db_database: process.env.DATABASE_DB_MOPE,
  db_port: process.env.PORT_DB_MOPE,
};
