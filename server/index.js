require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

app.use(cors());
app.use(express.json());

app.get("/expenses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error('GET error:', err.message)
    res.status(500).json({ error: err.message });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, date, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, amount, date, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST error:', err.message)
    res.status(500).json({ error: err.message });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    const result = await pool.query(
      `UPDATE expenses SET title = $1, amount = $2, date = $3, category = $4
       WHERE id = $5 RETURNING *`,
      [title, amount, date, category, req.params.id]
    );
    console.log('Updated rows:', result.rows)
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT error:', err.message)
    res.status(500).json({ error: err.message });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING *", 
      [req.params.id]
    );
    console.log('Deleted rows:', result.rows)
    res.status(204).send();
  } catch (err) {
    console.error('DELETE error:', err.message)
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});