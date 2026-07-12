import Program from '../models/program.model.js';
import Department from '../../department/models/department.model.js';

const getAll = async (adminId) => {
  return await Program.findAll({
    where: { adminId },
    include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
    order: [['id', 'DESC']],
  });
};

const create = async (data, adminId) => {
  return await Program.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const prog = await Program.findOne({ where: { id, adminId } });
  if (!prog) throw Object.assign(new Error("Program not found"), { status: 404 });
  return await prog.update(data);
};

const remove = async (id, adminId) => {
  const prog = await Program.findOne({ where: { id, adminId } });
  if (!prog) throw Object.assign(new Error("Program not found"), { status: 404 });
  await prog.destroy();
  return { message: "Program deleted" };
};

export default { getAll, create, update, remove };
