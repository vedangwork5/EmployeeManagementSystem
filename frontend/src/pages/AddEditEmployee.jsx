import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import employeeService from '../services/employeeService';
import './AddEditEmployee.css';

const AddEditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const employee = await employeeService.getById(id);

      // Format date for input field
      const formattedData = {
        ...employee,
        joining_date: employee.joining_date ? new Date(employee.joining_date).toISOString().split('T')[0] : '',
      };

      reset(formattedData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employee');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditMode) {
        await employeeService.update(id, data);
      } else {
        await employeeService.create(data);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading employee data...</div>;
  }

  return (
    <div className="add-edit-employee">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to List
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Employee saved successfully!</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              type="text"
              {...register('department')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              id="designation"
              type="text"
              {...register('designation')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
              type="number"
              step="0.01"
              {...register('salary', {
                min: { value: 0, message: 'Salary must be positive' },
              })}
              className={errors.salary ? 'input-error' : ''}
            />
            {errors.salary && <span className="error-message">{errors.salary.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="joining_date">Joining Date</label>
            <input
              id="joining_date"
              type="date"
              {...register('joining_date')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" {...register('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditEmployee;
