import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import employeeService from '../services/employeeService';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import './EmployeeList.css';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Pagination & filters
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Modals
  const [viewEmployee, setViewEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  // Unique departments and designations for filters
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const limit = 10;

  const loadEmployees = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageNum,
        limit,
        q: searchQuery,
        department,
        designation,
        sortBy,
        sortDir,
      };

      const response = await employeeService.getAll(params);

      if (reset) {
        setEmployees(response.data);
      } else {
        setEmployees((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.data.length === limit);

      // Extract unique departments and designations
      if (pageNum === 1) {
        const uniqueDepts = [...new Set(response.data.map(emp => emp.department).filter(Boolean))];
        const uniqueDesigs = [...new Set(response.data.map(emp => emp.designation).filter(Boolean))];
        setDepartments(uniqueDepts);
        setDesignations(uniqueDesigs);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, department, designation, sortBy, sortDir]);

  useEffect(() => {
    setPage(1);
    setEmployees([]);
    loadEmployees(1, true);
  }, [searchQuery, department, designation, sortBy, sortDir]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadEmployees(nextPage, false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteEmployee) return;

    try {
      await employeeService.delete(deleteEmployee._id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== deleteEmployee._id));
      setDeleteEmployee(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete employee');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="employee-list">
      <div className="page-header">
        <h1>Employee Management</h1>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          Add Employee
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters-section">
        <SearchBar onSearch={handleSearch} placeholder="Search by name or email..." />

        <div className="filters">
          <FilterDropdown
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departments}
            placeholder="All Departments"
          />
          <FilterDropdown
            label="Designation"
            value={designation}
            onChange={setDesignation}
            options={designations}
            placeholder="All Designations"
          />
        </div>
      </div>

      <InfiniteScroll
        dataLength={employees.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="loader">Loading more...</div>}
        endMessage={
          <div className="end-message">
            {employees.length === 0 ? 'No employees found' : 'No more employees to load'}
          </div>
        }
      >
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Email {getSortIcon('email')}
                </th>
                <th>Department</th>
                <th>Designation</th>
                <th onClick={() => handleSort('salary')} className="sortable">
                  Salary {getSortIcon('salary')}
                </th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department || 'N/A'}</td>
                  <td>{employee.designation || 'N/A'}</td>
                  <td>{formatCurrency(employee.salary)}</td>
                  <td>{formatDate(employee.joining_date)}</td>
                  <td>
                    <span className={`status-badge ${employee.status?.toLowerCase()}`}>
                      {employee.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-view"
                        onClick={() => setViewEmployee(employee)}
                        title="View"
                      >
                        👁
                      </button>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => navigate(`/edit/${employee._id}`)}
                        title="Edit"
                      >
                        ✏
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => setDeleteEmployee(employee)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfiniteScroll>

      {/* View Employee Modal */}
      {viewEmployee && (
        <Modal
          isOpen={Boolean(viewEmployee)}
          onClose={() => setViewEmployee(null)}
          title="Employee Details"
        >
          <div className="employee-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{viewEmployee.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{viewEmployee.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Department:</span>
              <span className="detail-value">{viewEmployee.department || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Designation:</span>
              <span className="detail-value">{viewEmployee.designation || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Salary:</span>
              <span className="detail-value">{formatCurrency(viewEmployee.salary)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Joining Date:</span>
              <span className="detail-value">{formatDate(viewEmployee.joining_date)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                <span className={`status-badge ${viewEmployee.status?.toLowerCase()}`}>
                  {viewEmployee.status || 'Active'}
                </span>
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteEmployee)}
        onClose={() => setDeleteEmployee(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteEmployee?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EmployeeList;
