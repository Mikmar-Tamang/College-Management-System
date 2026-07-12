import sq from "../../../config/db.js";
import { DataTypes } from "sequelize";

const sequelize = sq.sequelize;

const Department = sequelize.define("Department", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  hod: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  studentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("Active", "Inactive"),
    defaultValue: "Active",
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Department;
