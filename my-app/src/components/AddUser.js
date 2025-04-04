import React, { useState } from "react";
import { createUser } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const AddUser = ({ onUserAdded }) => {
    const [user, setUser] = useState({ name: "", email: "", age: "", city: "" });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createUser(user);
        onUserAdded();
        setUser({ name: "", email: "", age: "", city: "" }); // Clear form
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-center my-3">
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                    Add User
                </button>
            </div>

            {/* Modal */}
            <div className="modal fade" id="addUserModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New User</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={user.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={user.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Age:</label>
                                    <input
                                        type="number"
                                        name="age"
                                        className="form-control"
                                        value={user.age}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">City:</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-control"
                                        value={user.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-center my-3">
                                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addUserModal">
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
