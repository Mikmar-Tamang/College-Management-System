import Admin from '../modules/admin/models/admin.model.js';
import Department from '../modules/department/models/department.model.js';
import Program from '../modules/program/models/program.model.js';
import Semester from '../modules/semester/models/semester.model.js';
import AcademicYear from '../modules/academicYear/models/academicYear.model.js';
import Batch from '../modules/batch/models/batch.model.js';
import Student from '../modules/student/models/student.model.js';
import Scholarship from '../modules/scholarship/models/scholarship.model.js';
import FeePayment from '../modules/feePayment/models/feePayment.model.js';

/* ──────────────────────────────────────────────
   Sequelize Associations
   - Department 1:M Program
   - Department 1:M Student
   - Program    1:M Student
   - Student    1:M FeePayment
   ────────────────────────────────────────────── */

// Department has many Programs
Department.hasMany(Program, { foreignKey: 'departmentId', as: 'programs' });
Program.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Department has many Students
Department.hasMany(Student, { foreignKey: 'departmentId', as: 'students' });
Student.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Program has many Students
Program.hasMany(Student, { foreignKey: 'programId', as: 'students' });
Student.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

// Student has many FeePayments
Student.hasMany(FeePayment, { foreignKey: 'studentId', as: 'feePayments' });
FeePayment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

export default function setupAssociations() {
  console.log('✅ Sequelize associations set up successfully.');
}
