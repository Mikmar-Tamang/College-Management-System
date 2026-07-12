import sq from "../../../config/db.js";
import { DataTypes } from "sequelize";

const sequelize = sq.sequelize;

const Scholarship = sequelize.define("Scholarship", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eligibility: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  awarded: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("Active", "Closed"),
    defaultValue: "Active",
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Scholarship;
