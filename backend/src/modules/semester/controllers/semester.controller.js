import semesterService from '../services/semester.service.js';
import { getIO } from '../../../config/socket.js';

const getAll = async (req, res) => {
  try {
    const data = await semesterService.getAll(req.admin.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await semesterService.create(req.body, req.admin.id);
    getIO().emit('db-change', { action: 'created', module: 'Semester', data });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await semesterService.update(req.params.id, req.body, req.admin.id);
    getIO().emit('db-change', { action: 'updated', module: 'Semester', data });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await semesterService.remove(req.params.id, req.admin.id);
    getIO().emit('db-change', { action: 'deleted', module: 'Semester', data: { id: req.params.id } });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export default { getAll, create, update, remove };
