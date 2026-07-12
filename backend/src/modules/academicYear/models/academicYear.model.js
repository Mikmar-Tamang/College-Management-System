import sq from "../../../config/db.js";
import { DataTypes } from "sequelize";

const sequelize = sq.sequelize;

const AcademicYear = sequelize.define("AcademicYear", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  year: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Current", "Completed", "Upcoming"),
    defaultValue: "Upcoming",
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default AcademicYear;
