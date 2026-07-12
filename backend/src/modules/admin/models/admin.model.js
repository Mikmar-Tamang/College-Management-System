import sq from "../../../config/db.js";
import { DataTypes } from "sequelize";

const sequelize= sq.sequelize;

const Admin = sequelize.define("Admin", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    admin_name:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number:{
        type: DataTypes.STRING(15),
        allowNull: true
    },
    role:{
        type:  DataTypes.ENUM("college_admin", "super_admin"),
        allowNull: false,
        defaultValue: "college_admin"
    },
    collegeName:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    collegeCode:{
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    collegeAddress:{
        type: DataTypes.STRING(200),
        allowNull: true
    },
    collegeEmail:{
        type: DataTypes.STRING(100),
        allowNull: true,
        unique:true,
        validate: {
            isEmail: true
        }
    },
    collegePhoneNumber:{
        type: DataTypes.STRING(15),
        allowNull: true
    },
    isVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBanned:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isApproved:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: DataTypes.STRING,
    verificationTokenExpiry: DataTypes.DATE,
    resetPasswordCode: DataTypes.STRING,
    resetPasswordExpiry: DataTypes.DATE
})

export default Admin;