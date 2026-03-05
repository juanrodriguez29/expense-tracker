require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/expenses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const { id, title, amount, date, category } = req.body;
    await pool.query(
      `INSERT INTO expenses (id, title, amount, date, category)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, title, amount, date, category]
    );
    res.status(201).json({ id, title, amount, date, category });
  } catch (err) {
    res.status(500).json({ error: "Failed to save expense" });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    await pool.query(
      `UPDATE expenses SET title = $1, amount = $2, date = $3, category = $4
       WHERE id = $5`,
      [title, amount, date, category, req.params.id]
    );
    res.json({ id: req.params.id, title, amount, date, category });
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM expenses WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});