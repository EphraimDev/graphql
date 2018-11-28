require('dotenv').config();

module.exports={
  development: {
    username: process.env.db_USer,
    password: process.env.db_Pass,
    database: process.env.db_Name,
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432
  },
  test: {
    username: process.env.db_USer,
    password: process.env.db_Pass,
    database: process.env.db_Name,
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432
  },
  production: {
    username: process.env.db_USer,
    password: process.env.db_Pass,
    database: process.env.db_Name,
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432
  },
  cloudinary:{
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
  }
}
