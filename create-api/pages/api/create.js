import { createConnection } from 'mysql2/promise';

// Function to create a MySQL connection
async function connectToDatabase() {
    return createConnection({
        host: 'localhost',
        user: 'root',
        password: 'jaiganesh',
        database: 'testdb',
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const userdata = req.body;
    console.log(userdata)

    const { name, email,age ,city} = userdata;

    if (!name || !email || !age || !city) {
        return res.status(400).json({ error: 'name, email, and city are required in the request body.' });
    }
    try {
        // const hashedcity = await bcrypt.hash(city, 10); // 10 is the number of salt rounds

        // Connect to the database
        const connection = await connectToDatabase();

        // Execute a query to retrieve data from the "user" table
        const [result] = await connection.execute('INSERT INTO users (name, email,age,city) VALUES (?, ?, ?, ?)', [
            name,
            email,
            age,
            city,
        ]);
        // Check if the user exists

        // Close the database connection
        await connection.end();

        // Respond with the user data
        res.status(201).json({ id: result.insertId, message: 'User created successfully' });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
