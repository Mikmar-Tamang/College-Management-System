import express from 'express';
const app = express();
import cookieParser from "cookie-parser"
import cors from 'cors';
import authRoutes from './modules/auth/routes/auth.route.js';
import adminRoutes from './modules/admin/routes/admin.route.js';
import departmentRoutes from './modules/department/routes/department.route.js';
import programRoutes from './modules/program/routes/program.route.js';
import semesterRoutes from './modules/semester/routes/semester.route.js';
import academicYearRoutes from './modules/academicYear/routes/academicYear.route.js';
import batchRoutes from './modules/batch/routes/batch.route.js';
import studentRoutes from './modules/student/routes/student.route.js';
import scholarshipRoutes from './modules/scholarship/routes/scholarship.route.js';
import feePaymentRoutes from './modules/feePayment/routes/feePayment.route.js';

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials:true,
  methods:['GET',"POST","PUT","DELETE","OPTIONS"],
  allowedHeaders:["Content-Type", "Authorization", "Cookie"],
  exposedHeaders:["Set-Cookie"]
}))

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/fee-payments', feePaymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;