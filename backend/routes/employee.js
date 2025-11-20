const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Create employee
router.post('/', async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
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
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!emp) return res.status(404).json({ error: 'Not found' });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Not found' });
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
    const {
      q, department, designation,
      sortBy = 'createdAt', sortDir = 'desc',
      page = 1, limit = 10
    } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    if (department) filter.department = department;
    if (designation) filter.designation = designation;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const sort = {};
    sort[sortBy] = sortDir === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Employee.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Employee.countDocuments(filter)
    ]);

    res.json({
      data: items,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / Math.max(1, parseInt(limit)))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
