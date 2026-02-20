import React, { useState, useEffect } from 'react';
import { Balance } from './components/Balance';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { EditExpenseModal } from './components/EditExpenseModal';
import { CategoryTotals } from './components/CategoryTotals';
import { CategoryPieChart } from './components/CategoryPieChart';
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

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const chartData = Object.values(
  expenses.reduce((acc, exp) => {
    const categoryId = exp.category;
    if (!CATEGORY_MAP[categoryId]) return acc; // skip invalid categories

    // Initialize category bucket if not exists
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: String(CATEGORY_MAP[categoryId]), // ensure string
        value: 0
      };
    }

    // Add expense amount safely
    const amount = Number(exp.amount);
    acc[categoryId].value += isNaN(amount) ? 0 : amount;

    return acc;
  }, {})
  );

  const experiment = { name: "Food", value: 120 };
   
  

  const [editingExpense, setEditingExpense] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const expensesToShow = activeCategory ? expenses.filter(exp => exp.category === activeCategory)
: expenses;

  const addExpense = (expense) => setExpenses(prev => [...prev, expense]);

  const startEditing = (expense) => {
    setEditingExpense(expense);
  };

  const deleteExpense = (id) =>
    setExpenses(prev => prev.filter(exp => exp.id !== id));

  const handleSaveEdit = (updatedExpense) => {
    setExpenses(prev =>
      prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
    );
    setEditingExpense(null);
    
  };

  const handleCategoryClick = (categoryId) => {

    setActiveCategory(categoryId);

  };

  console.log(chartData);

  




  return (
    <div className="app">
      <h1>Expense Tracker</h1>
      <Balance expenses={expenses} />
      <CategoryPieChart data={chartData} />
      <CategoryTotals expenses={expenses} categories={CATEGORIES} expensesToShow={expensesToShow} />
      <ExpenseForm onAddExpense={addExpense} categories={CATEGORIES} onClearFilter={() => setActiveCategory(null)} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} onEdit={startEditing} categoryMap={CATEGORY_MAP} expensesToShow={expensesToShow} onCategoryClick={handleCategoryClick} activeCategory={activeCategory} />
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

