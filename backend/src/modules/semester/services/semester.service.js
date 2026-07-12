import Semester from '../models/semester.model.js';

const getAll = async (adminId) => {
  return await Semester.findAll({ where: { adminId }, order: [['id', 'DESC']] });
};

const create = async (data, adminId) => {
  return await Semester.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const sem = await Semester.findOne({ where: { id, adminId } });
  if (!sem) throw Object.assign(new Error("Semester not found"), { status: 404 });
  return await sem.update(data);
};

const remove = async (id, adminId) => {
  const sem = await Semester.findOne({ where: { id, adminId } });
  if (!sem) throw Object.assign(new Error("Semester not found"), { status: 404 });
  await sem.destroy();
  return { message: "Semester deleted" };
};

export default { getAll, create, update, remove };
