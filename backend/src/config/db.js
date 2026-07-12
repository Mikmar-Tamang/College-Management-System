import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL,{
    dialect: "mysql",
});

const dbConnection = async () => {
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
}

export default {dbConnection, sequelize};