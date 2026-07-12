import Department from '../models/department.model.js';

const getAll = async (adminId) => {
  return await Department.findAll({ where: { adminId }, order: [['id', 'DESC']] });
};

const create = async (data, adminId) => {
  return await Department.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const dept = await Department.findOne({ where: { id, adminId } });
  if (!dept) throw Object.assign(new Error("Department not found"), { status: 404 });
  return await dept.update(data);
};

const remove = async (id, adminId) => {
  const dept = await Department.findOne({ where: { id, adminId } });
  if (!dept) throw Object.assign(new Error("Department not found"), { status: 404 });
  await dept.destroy();
  return { message: "Department deleted" };
};

export default { getAll, create, update, remove };
