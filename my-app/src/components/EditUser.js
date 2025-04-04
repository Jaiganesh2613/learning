import React, { useState } from "react";
import { updateUser } from "../services/api";
import { Modal, Button, Form } from "react-bootstrap";

const EditUser = ({ user, onClose, onUpdate }) => {
    const [updatedUser, setUpdatedUser] = useState({ ...user });

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser(user.id, updatedUser);
        onUpdate();
        onClose();
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={updatedUser.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Age:</Form.Label>
                        <Form.Control
                            type="number"
                            name="age"
                            value={updatedUser.age}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>City:</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={updatedUser.city}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">Update</Button>
                    <Button variant="secondary" className="ms-2" onClick={onClose}>Cancel</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUser;
