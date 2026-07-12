import scholarshipService from '../services/scholarship.service.js';
import { getIO } from '../../../config/socket.js';

const getAll = async (req, res) => {
  try {
    const data = await scholarshipService.getAll(req.admin.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await scholarshipService.create(req.body, req.admin.id);
    getIO().emit('db-change', { action: 'created', module: 'Scholarship', data });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await scholarshipService.update(req.params.id, req.body, req.admin.id);
    getIO().emit('db-change', { action: 'updated', module: 'Scholarship', data });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await scholarshipService.remove(req.params.id, req.admin.id);
    getIO().emit('db-change', { action: 'deleted', module: 'Scholarship', data: { id: req.params.id } });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export default { getAll, create, update, remove };
