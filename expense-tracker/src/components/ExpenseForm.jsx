
import { useState } from "react";

export function ExpenseForm({ onAddExpense, categories, onClearFilter }) {

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const validateAmount = (e) => {
    const value = e.target.value;
    const regex = /^\d*(\.\d{0,2})?$/;
    if (value === "" || value.startsWith("-") || !regex.test(value)) return;
    setAmount(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    onAddExpense({
      id: crypto.randomUUID(),
      title,
      amount,
      date,
      category,
    });
    setTitle("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    onClearFilter();
  };

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        placeholder="Expense name"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={validateAmount}
        className={inputClass}
      />
      <input
        type="date"
        value={date}
        max={today}
        onChange={e => setDate(e.target.value)}
        className={inputClass}
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className={inputClass}
      >
        <option value="">Select a category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-lg transition-all duration-150"
      >
        Add Expense
      </button>
    </form>
  );
}