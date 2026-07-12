import Batch from '../models/batch.model.js';

const getAll = async (adminId) => {
  return await Batch.findAll({ where: { adminId }, order: [['id', 'DESC']] });
};

const create = async (data, adminId) => {
  return await Batch.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const batch = await Batch.findOne({ where: { id, adminId } });
  if (!batch) throw Object.assign(new Error("Batch not found"), { status: 404 });
  return await batch.update(data);
};

const remove = async (id, adminId) => {
  const batch = await Batch.findOne({ where: { id, adminId } });
  if (!batch) throw Object.assign(new Error("Batch not found"), { status: 404 });
  await batch.destroy();
  return { message: "Batch deleted" };
};

export default { getAll, create, update, remove };
