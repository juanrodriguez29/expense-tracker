import React, { useState } from 'react';
import { Balance } from './components/Balance';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { EditExpenseModal } from './components/EditExpenseModal';
import './App.css';

export default function App() {

  const CATEGORIES = [
    { id: "food", label: "Food" },
    { id: "transport", label: "Transport" },
    { id: "bills", label: "Bills" },
    { id: "shopping", label: "Shopping" },
    { id: "entertainment", label: "Entertainment" },
    { id: "health", label: "Health" },
    { id: "savings", label: "Savings" },
    { id: "other", label: "Other" },
  ];

  const CATEGORY_MAP = Object.fromEntries(
    CATEGORIES.map(cat => [cat.id, cat.label])
  );

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const addExpense = (expense) => setExpenses(prev => [...prev, expense]);

  const startEditing = (expense) => {
    setEditingExpense(expense);
  }; 

  const deleteExpense = (id) =>
    setExpenses(prev => prev.filter(exp => exp.id !== id));

  const handleSaveEdit = (updatedExpense) => {
    setExpenses(prev => 
      prev.map(exp =>  exp.id === updatedExpense.id ? updatedExpense : exp)
    );
    setEditingExpense(null);
  };

  
  return (
    <div className="app">
      <h1>Expense Tracker</h1>
      <Balance expenses={expenses} />
      <ExpenseForm onAddExpense={addExpense} categories={CATEGORIES}  />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} onEdit={startEditing} categoryMap={CATEGORY_MAP} />
      {editingExpense &&
        (<EditExpenseModal
          expense={editingExpense}
          onSave={handleSaveEdit}
          onCancel={() => setEditingExpense(null)}
          categories={CATEGORIES}
        />)
      }
    </div>
  );
}

