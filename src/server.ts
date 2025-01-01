import express from "express";
import cors from "cors";
import { Pool, Query } from "pg";
import dotenv from "dotenv";
import { User } from "./types/user";

dotenv.config();

interface QueryRequest extends express.Request {
    body : {
        query: string;
    };
}

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

app.use((req, res, next) => {
    console.log(`Received request for path: ${req.path}`);  // This will print every path that hits the server
    next();
});

app.get("/api/users", async (req: express.Request, res: express.Response) => {
    try {
        const result = await pool.query<User>(
            "SELECT * FROM users ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Query error:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.get("/api/users/profiles", async (req: express.Request, res: express.Response) => {
    console.log("hi")
    try {
        const result = await pool.query<User>(
            "SELECT users.id, first_name, last_name, email, date_of_birth, bio FROM users LEFT JOIN user_profiles ON users.id = user_profiles.id ORDER BY users.id ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Query error:", err);
        res.status(500).json({ error: "Failed to fetch user profiles" });
    }
});

app.get("/api/users/:id(\\d+)", async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    console.log(`hello ${id}`);
    try {
        const result = await pool.query<User>(
            "SELECT * FROM users WHERE id=$1", [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Query error:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

app.post("/api/users", async (req: express.Request, res: express.Response) => {
    const { first_name, last_name, email } = req.body;
    try {
        const result = await pool.query<User>(
            "INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3)", [first_name, last_name, email] 
        )
    } catch (err) {
        console.error("Query error:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
})

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;