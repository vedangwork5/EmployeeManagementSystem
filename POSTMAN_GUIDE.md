# Postman Collection Guide - Employee Management API

## How to Import the Collection

1. Open Postman
2. Click "Import" button (top left)
3. Select the file: `Employee_Management_API.postman_collection.json`
4. The collection will appear in your Collections sidebar

## Collection Overview

This Postman collection contains all API endpoints for the Employee Management System with 16 pre-configured requests.

### Available Endpoints

#### 1. **Create Employee** (POST)
- **URL**: `http://localhost:5000/api/employees`
- **Description**: Create a new employee
- **Body Example**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "designation": "Senior Developer",
  "salary": 75000,
  "joining_date": "2024-01-15",
  "status": "Active"
}
```

#### 2. **Get All Employees - Basic** (GET)
- **URL**: `http://localhost:5000/api/employees`
- **Description**: Get all employees with default pagination
- **Default**: Page 1, Limit 10

#### 3. **Get All Employees - With Pagination** (GET)
- **URL**: `http://localhost:5000/api/employees?page=1&limit=20`
- **Query Params**:
  - `page`: Page number (1-based)
  - `limit`: Items per page

#### 4. **Search Employees** (GET)
- **URL**: `http://localhost:5000/api/employees?q=john`
- **Query Params**:
  - `q`: Search term (searches in name and email)

#### 5. **Filter by Department** (GET)
- **URL**: `http://localhost:5000/api/employees?department=Engineering`
- **Query Params**:
  - `department`: Department name

#### 6. **Filter by Designation** (GET)
- **URL**: `http://localhost:5000/api/employees?designation=Senior Developer`
- **Query Params**:
  - `designation`: Job title

#### 7. **Sort by Name** (GET)
- **URL**: `http://localhost:5000/api/employees?sortBy=name&sortDir=asc`
- **Query Params**:
  - `sortBy`: Field to sort (name, email, salary, createdAt)
  - `sortDir`: Direction (asc or desc)

#### 8. **Sort by Salary** (GET)
- **URL**: `http://localhost:5000/api/employees?sortBy=salary&sortDir=desc`

#### 9. **Advanced Search** (GET)
- **URL**: Combined filters example
- **Query Params**: Search + Filter + Sort + Pagination combined

#### 10. **Get Single Employee** (GET)
- **URL**: `http://localhost:5000/api/employees/{{employee_id}}`
- **Description**: Get employee by ID
- **Note**: Replace `{{employee_id}}` with actual MongoDB ObjectId

#### 11. **Update Employee** (PUT)
- **URL**: `http://localhost:5000/api/employees/{{employee_id}}`
- **Description**: Full update of employee
- **Note**: Include all required fields

#### 12. **Update Employee - Partial** (PUT)
- **URL**: `http://localhost:5000/api/employees/{{employee_id}}`
- **Description**: Update only specific fields
- **Body Example**:
```json
{
  "salary": 90000,
  "designation": "Senior Lead Developer"
}
```

#### 13. **Delete Employee** (DELETE)
- **URL**: `http://localhost:5000/api/employees/{{employee_id}}`
- **Description**: Delete employee by ID

#### 14-16. **Sample Employee Creation**
- Pre-configured requests to create sample employees in different departments
- Marketing, HR, Finance examples included

## Using Variables

The collection includes two variables:

1. **base_url**: `http://localhost:5000/api`
   - Change this if your backend runs on a different port

2. **employee_id**: Empty by default
   - Set this to test single employee operations
   - Or manually replace `{{employee_id}}` in URLs

### How to Set Variables

1. Click on the collection name
2. Go to "Variables" tab
3. Update the "Current Value" column
4. Save

## Testing Workflow

### Step 1: Create Sample Data
Run these requests in order:
1. Create Employee (main)
2. Sample Employee - Marketing
3. Sample Employee - HR
4. Sample Employee - Finance

### Step 2: Test Listing & Filters
1. Get All Employees (Basic)
2. Search Employees
3. Filter by Department
4. Sort by Salary

### Step 3: Test Single Employee Operations
1. Get Single Employee (copy an ID from previous responses)
2. Update Employee (use the same ID)
3. Get Single Employee (verify changes)
4. Delete Employee

## Query Parameters Reference

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| q | string | Search by name or email | `q=john` |
| department | string | Filter by department | `department=Engineering` |
| designation | string | Filter by designation | `designation=Senior Developer` |
| sortBy | string | Field to sort by | `sortBy=salary` |
| sortDir | string | Sort direction (asc/desc) | `sortDir=desc` |
| page | number | Page number (1-based) | `page=2` |
| limit | number | Items per page | `limit=20` |

## Sample Response Format

### List Response
```json
{
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "department": "Engineering",
      "designation": "Senior Developer",
      "salary": 75000,
      "joining_date": "2024-01-15T00:00:00.000Z",
      "status": "Active",
      "createdAt": "2024-11-20T10:30:00.000Z",
      "updatedAt": "2024-11-20T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Single Employee Response
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "designation": "Senior Developer",
  "salary": 75000,
  "joining_date": "2024-01-15T00:00:00.000Z",
  "status": "Active",
  "createdAt": "2024-11-20T10:30:00.000Z",
  "updatedAt": "2024-11-20T10:30:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Tips

1. **Save Employee IDs**: After creating employees, copy their `_id` values to test update/delete operations

2. **Test Pagination**: Create multiple employees (15+) to see pagination in action

3. **Combine Filters**: Try combining search, filters, and sorting in one request

4. **Check Headers**: All POST/PUT requests have `Content-Type: application/json` header

5. **Environment Setup**: Consider creating a Postman Environment for different setups (local, staging, production)

## Troubleshooting

- **Connection Refused**: Make sure backend server is running (`npm start` in backend folder)
- **404 Errors**: Verify the base URL is correct
- **Invalid ID**: MongoDB IDs are 24-character hex strings
- **Validation Errors**: Check required fields (name and email are required)

## Next Steps

After testing with Postman, use these same endpoints in your React frontend application!
