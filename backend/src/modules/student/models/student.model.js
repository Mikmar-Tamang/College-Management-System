import sq from "../../../config/db.js";
import { DataTypes } from "sequelize";

const sequelize = sq.sequelize;

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rollNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("Student", "Class Representative", "Lab Assistant", "Sports Captain", "Cultural Secretary"),
    defaultValue: "Student",
  },
  status: {
    type: DataTypes.ENUM("Active", "Graduated"),
    defaultValue: "Active",
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Student;
