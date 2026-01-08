import React, { useState } from 'react';
import { Balance } from './components/Balance';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { EditExpenseModal } from './components/EditExpenseModal';
import './App.css';

export default function App() {
  
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const addExpense = (expense) => setExpenses(prev => [...prev, expense]);

  const startEditing = (expense) => {
    setEditingExpense(expense);
  }  
  const editExpense = (id, updatedData) => {
      
      setExpenses(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, ...updatedData } : exp))
    );
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
      <ExpenseForm onAddExpense={addExpense}  />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} onEdit={startEditing} />
      {editingExpense &&
        (<EditExpenseModal
          expense={editingExpense}
          onSave={handleSaveEdit}
          onCancel={() => setEditingExpense(null)}
        />)
      }
    </div>
  );
}

