import FeePayment from '../models/feePayment.model.js';
import Student from '../../student/models/student.model.js';

const getAll = async (adminId) => {
  return await FeePayment.findAll({
    where: { adminId },
    include: [{ model: Student, as: 'student', attributes: ['id', 'name', 'rollNo'] }],
    order: [['id', 'DESC']],
  });
};

const create = async (data, adminId) => {
  return await FeePayment.create({ ...data, adminId });
};

const update = async (id, data, adminId) => {
  const pay = await FeePayment.findOne({ where: { id, adminId } });
  if (!pay) throw Object.assign(new Error("Fee payment not found"), { status: 404 });
  return await pay.update(data);
};

const remove = async (id, adminId) => {
  const pay = await FeePayment.findOne({ where: { id, adminId } });
  if (!pay) throw Object.assign(new Error("Fee payment not found"), { status: 404 });
  await pay.destroy();
  return { message: "Fee payment deleted" };
};

export default { getAll, create, update, remove };
