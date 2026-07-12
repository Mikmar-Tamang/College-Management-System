import sq from "../../../config/db.js";
import { DataTypes } from "sequelize";

const sequelize = sq.sequelize;

const FeePayment = sequelize.define("FeePayment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  feeType: {
    type: DataTypes.ENUM("Monthly", "Semester"),
    allowNull: false,
    defaultValue: "Semester",
  },
  semester: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  month: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  paidDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Paid", "Pending", "Overdue"),
    defaultValue: "Pending",
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default FeePayment;
