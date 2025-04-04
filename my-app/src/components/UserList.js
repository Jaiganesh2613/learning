import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import EditUser from "./EditUser";
import "bootstrap/dist/css/bootstrap.min.css";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const handleDelete = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3 text-center">User List</h2>
            <div className="row">
                {users.map(user => (
                    <div className="col-md-4 mb-4" key={user.id}>
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">{user.name}</h5>
                                <p className="card-text">
                                    <strong>Email:</strong> {user.email} <br />
                                    <strong>Age:</strong> {user.age} <br />
                                    <strong>City:</strong> {user.city}
                                </p>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => setEditUser(user)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit User Modal */}
            {editUser && (
                <EditUser
                    user={editUser}
                    onClose={() => setEditUser(null)}
                    onUpdate={fetchUsers}
                />
            )}
        </div>
    );
};

export default UserList;
