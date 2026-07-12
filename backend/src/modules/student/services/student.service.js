import Student from '../models/student.model.js';
import Department from '../../department/models/department.model.js';
import Program from '../../program/models/program.model.js';

const getAll = async (adminId) => {
  return await Student.findAll({
    where: { adminId },
    include: [
      { model: Department, as: 'department', attributes: ['id', 'name'] },
      { model: Program, as: 'program', attributes: ['id', 'name', 'code'] },
    ],
    order: [['id', 'DESC']],
  });
};

const create = async (data, adminId) => {
  return await Student.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const student = await Student.findOne({ where: { id, adminId } });
  if (!student) throw Object.assign(new Error("Student not found"), { status: 404 });
  return await student.update(data);
};

const remove = async (id, adminId) => {
  const student = await Student.findOne({ where: { id, adminId } });
  if (!student) throw Object.assign(new Error("Student not found"), { status: 404 });
  await student.destroy();
  return { message: "Student deleted" };
};

export default { getAll, create, update, remove };
