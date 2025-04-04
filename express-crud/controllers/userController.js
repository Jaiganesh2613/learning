const db = require('../database');
const express = require("express");

// Get all users
const router = express.Router();

exports.getUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// Get a single user by ID
exports.getUserById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(results[0]);
    });
};

// Create a new user
exports.createUser = (req, res) => {
    const { name, email, age, city } = req.body;
    db.query('INSERT INTO users (name, email, age, city) VALUES (?, ?, ?, ?)',
        [name, email, age, city],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, name, email, age, city });
        }
    );
};

// Update a user
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, age, city } = req.body;

    db.query('UPDATE users SET name = ?, email = ?, age = ?, city = ? WHERE id = ?',
        [name, email, age, city, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ message: 'User updated successfully' });
        }
    );
};

// Delete a user
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    });
};
