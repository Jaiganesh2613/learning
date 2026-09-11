import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  UserCheck,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  LayoutDashboard,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:8080/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
  });

// Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await axios.get(API_URL);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadEmployees();


  }, []);

// Fetch employees again after add/edit/delete
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

// Input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));


  };

// Open Add modal
  const openAddModal = () => {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      department: "",
    });

    setShowModal(true);


  };

// Open Edit modal
  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
    });

    setShowModal(true);


  };

// Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

// Add / Update
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      closeModal();
      await fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
    }


  };

// Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }


  };

// Search
  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    return (
        employee.name.toLowerCase().includes(searchText) ||
        employee.email.toLowerCase().includes(searchText) ||
        employee.department.toLowerCase().includes(searchText)
    );


  });

// Number of departments
  const departmentCount = new Set(
      employees.map((employee) => employee.department)
  ).size;

  return (
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">
              <Users size={22} />
            </div>

            <span>EmployeeHub</span>
          </div>

          <nav>
            <div className="nav-item active">
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </div>

            <div className="nav-item">
              <Users size={19} />
              <span>Employees</span>
            </div>

            <div className="nav-item">
              <Building2 size={19} />
              <span>Departments</span>
            </div>
          </nav>

          <div className="sidebar-bottom">
            <div className="profile">
              <div className="profile-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          {/* Header */}
          <header className="header">
            <div>
              <h1>Dashboard</h1>
              <p>Manage your employees and organization.</p>
            </div>

            <button className="add-button" onClick={openAddModal}>
              <Plus size={18} />
              Add Employee
            </button>
          </header>

          {/* Statistics */}
          <section className="stats">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Users size={22} />
              </div>

              <div>
                <span>Total Employees</span>
                <strong>{employees.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <Building2 size={22} />
              </div>

              <div>
                <span>Departments</span>
                <strong>{departmentCount}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <UserCheck size={22} />
              </div>

              <div>
                <span>Active Employees</span>
                <strong>{employees.length}</strong>
              </div>
            </div>
          </section>

          {/* Employee table */}
          <section className="employee-section">
            <div className="section-header">
              <div>
                <h2>Employees</h2>
                <p>{filteredEmployees.length} employees found</p>
              </div>

              <div className="search-box">
                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>ID</th>
                  <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty">
                        No employees found
                      </td>
                    </tr>
                ) : (
                    filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            <div className="employee-info">
                              <div className="avatar">
                                {employee.name.charAt(0).toUpperCase()}
                              </div>

                              <strong>{employee.name}</strong>
                            </div>
                          </td>

                          <td className="email">{employee.email}</td>

                          <td>
                    <span className="department">
                      {employee.department}
                    </span>
                          </td>

                          <td>#{employee.id}</td>

                          <td>
                            <div className="actions">
                              <button
                                  className="icon-button edit"
                                  onClick={() => handleEdit(employee)}
                                  title="Edit"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                  className="icon-button delete"
                                  onClick={() => handleDelete(employee.id)}
                                  title="Delete"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Add/Edit Modal */}
        {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <div>
                    <h2>
                      {editingId !== null ? "Edit Employee" : "Add Employee"}
                    </h2>

                    <p>
                      {editingId !== null
                          ? "Update employee information."
                          : "Enter employee information below."}
                    </p>
                  </div>

                  <button className="close-button" onClick={closeModal}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <label>
                    Name

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter employee name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                  </label>

                  <label>
                    Email

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                  </label>

                  <label>
                    Department

                    <input
                        type="text"
                        name="department"
                        placeholder="Enter department"
                        value={form.department}
                        onChange={handleChange}
                        required
                    />
                  </label>

                  <div className="modal-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="save-button">
                      {editingId !== null ? "Update Employee" : "Add Employee"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>


  );
}

export default App;