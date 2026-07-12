import AcademicYear from '../models/academicYear.model.js';

const getAll = async (adminId) => {
  return await AcademicYear.findAll({ where: { adminId }, order: [['id', 'DESC']] });
};

const create = async (data, adminId) => {
  return await AcademicYear.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const yr = await AcademicYear.findOne({ where: { id, adminId } });
  if (!yr) throw Object.assign(new Error("Academic year not found"), { status: 404 });
  return await yr.update(data);
};

const remove = async (id, adminId) => {
  const yr = await AcademicYear.findOne({ where: { id, adminId } });
  if (!yr) throw Object.assign(new Error("Academic year not found"), { status: 404 });
  await yr.destroy();
  return { message: "Academic year deleted" };
};

export default { getAll, create, update, remove };
