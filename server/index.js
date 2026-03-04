require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/expenses", (req, res) => {
  try {
    const expenses = db.prepare("SELECT * FROM expenses ORDER BY date DESC").all();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/expenses", (req, res) => {
  try {
    const { id, title, amount, date, category } = req.body;
    db.prepare(`
      INSERT INTO expenses (id, title, amount, date, category)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, title, amount, date, category);
    res.status(201).json({ id, title, amount, date, category });
  } catch (err) {
    res.status(500).json({ error: "Failed to save expense" });
  }
});

app.put("/expenses/:id", (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    db.prepare(`
      UPDATE expenses SET title = ?, amount = ?, date = ?, category = ?
      WHERE id = ?
    `).run(title, amount, date, category, req.params.id);
    res.json({ id: req.params.id, title, amount, date, category });
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

app.delete("/expenses/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM expenses WHERE id = ?").run(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});