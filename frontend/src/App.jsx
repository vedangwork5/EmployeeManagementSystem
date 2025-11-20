import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList';
import AddEditEmployee from './pages/AddEditEmployee';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<AddEditEmployee />} />
          <Route path="/edit/:id" element={<AddEditEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
