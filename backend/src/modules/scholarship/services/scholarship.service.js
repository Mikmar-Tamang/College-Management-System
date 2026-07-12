import Scholarship from '../models/scholarship.model.js';

const getAll = async (adminId) => {
  return await Scholarship.findAll({ where: { adminId }, order: [['id', 'DESC']] });
};

const create = async (data, adminId) => {
  return await Scholarship.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const sch = await Scholarship.findOne({ where: { id, adminId } });
  if (!sch) throw Object.assign(new Error("Scholarship not found"), { status: 404 });
  return await sch.update(data);
};

const remove = async (id, adminId) => {
  const sch = await Scholarship.findOne({ where: { id, adminId } });
  if (!sch) throw Object.assign(new Error("Scholarship not found"), { status: 404 });
  await sch.destroy();
  return { message: "Scholarship deleted" };
};

export default { getAll, create, update, remove };
