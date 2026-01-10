import { useState } from "react";

import "./ExpenseForm.css";

export function ExpenseForm({ onAddExpense, categories }) {

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  

  const valitateAmount = (e) => {
    
    const value = e.target.value;
    const regex = /^\d*(\.\d{0,2})?$/;
    if (value === "" || value.startsWith("-") || !regex.test(value)) {
      return;
    };

    setAmount(value);
  } 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) return;

    onAddExpense({
      id: crypto.randomUUID(),
      title,
      amount: amount,
      category,
    });

    setTitle("");
    setAmount("");
  };


  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        placeholder="Expense Name"
        value={title}
        onChange = {e => setTitle(e.target.value)}
      />
      <input 
        type="number"
        placeholder="Amount"
        value={amount}
        onChange = {valitateAmount}
      /> 
      <select className="category-select" value={category} onChange={e => setCategory(e.target.value)}>
        <option>Select a category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>))}
      </select>
      <button type="submit">Add Expense</button> 
    </form>
  );
}
