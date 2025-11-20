import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// Create employee
router.post('/', async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read single
router.get('/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Not found' });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const emp = await Employee.update(req.params.id, req.body);
    if (!emp) return res.status(404).json({ error: 'Not found' });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Listing with search, filters, sort and pagination
 * Query params:
 *  q - search string (name or email)
 *  department - department filter
 *  designation - designation filter
 *  sortBy - e.g. name, salary
 *  sortDir - asc or desc
 *  page - page number (1-based)
 *  limit - items per page
*/
router.get('/', async (req, res) => {
  try {
    const result = await Employee.findAll(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
