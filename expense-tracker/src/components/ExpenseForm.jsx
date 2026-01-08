import { useState } from "react";

import "./ExpenseForm.css";

export function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

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
      <button type="submit">Add Expense</button> 
    </form>
  );
}
