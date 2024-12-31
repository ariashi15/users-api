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

app.get("api/users", async (req: express.Request, res: express.Response) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;