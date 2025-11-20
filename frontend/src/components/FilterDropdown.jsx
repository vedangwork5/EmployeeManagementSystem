import './FilterDropdown.css';

const FilterDropdown = ({ label, value, onChange, options, placeholder = 'Select...' }) => {
  return (
    <div className="filter-dropdown">
      <label className="filter-label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="filter-select">
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
