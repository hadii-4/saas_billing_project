const { DataSource } = require("typeorm");
require('dotenv').config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME, // .env mein DB_USERNAME hai
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Isse tables khud ban jayenge
    logging: false,
    entities: [__dirname + "/../entities/*.js"],
});

module.exports = AppDataSource;