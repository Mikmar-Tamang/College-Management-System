import sq from "../../../config/db.js";
import { DataTypes } from "sequelize";

const sequelize = sq.sequelize;

const Batch = sequelize.define("Batch", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  students: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  program: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Active", "Completed"),
    defaultValue: "Active",
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Batch;
