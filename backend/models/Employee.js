import pool from '../config/database.js';

const Employee = {
  // Create a new employee
  create: async (employeeData) => {
    const { name, email, department, designation, salary, joining_date, status } = employeeData;
    const [result] = await pool.execute(
      'INSERT INTO employees (name, email, department, designation, salary, joining_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, department || null, designation || null, salary || 0, joining_date || null, status || 'Active']
    );
    return { id: result.insertId, ...employeeData };
  },

  // Find employee by ID
  findById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Update employee by ID
  update: async (id, employeeData) => {
    const { name, email, department, designation, salary, joining_date, status } = employeeData;
    const [result] = await pool.execute(
      'UPDATE employees SET name = ?, email = ?, department = ?, designation = ?, salary = ?, joining_date = ?, status = ? WHERE id = ?',
      [name, email, department, designation, salary, joining_date, status, id]
    );

    if (result.affectedRows === 0) return null;
    return await Employee.findById(id);
  },

  // Delete employee by ID
  delete: async (id) => {
    const [result] = await pool.execute('DELETE FROM employees WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Find all employees with filtering, sorting, and pagination
  findAll: async (options = {}) => {
    const { q, department, designation, sortBy = 'created_at', sortDir = 'desc', page = 1, limit = 10 } = options;

    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    // Search filter
    if (q) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    // Department filter
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    // Designation filter
    if (designation) {
      query += ' AND designation = ?';
      params.push(designation);
    }

    // Sorting
    const validSortColumns = ['id', 'name', 'email', 'department', 'designation', 'salary', 'joining_date', 'status', 'created_at', 'updated_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortDir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortColumn} ${sortDirection}`;

    // Pagination
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    // Execute query
    const [rows] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM employees WHERE 1=1';
    const countParams = [];

    if (q) {
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${q}%`, `%${q}%`);
    }
    if (department) {
      countQuery += ' AND department = ?';
      countParams.push(department);
    }
    if (designation) {
      countQuery += ' AND designation = ?';
      countParams.push(designation);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    return {
      data: rows,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / Math.max(1, parseInt(limit)))
      }
    };
  }
};

export default Employee;
