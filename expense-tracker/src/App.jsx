import React, { useState, useEffect } from 'react';
import { Balance } from './components/Balance';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { EditExpenseModal } from './components/EditExpenseModal';
import { CategoryTotals } from './components/CategoryTotals';
import { CategoryPieChart } from './components/CategoryPieChart';
import { FilterBar } from './components/FilterBar';
import "./App.css";

const API = import.meta.env.VITE_API_URL;

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

export default function App() {

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load expenses from the server when the app first opens
useEffect(() => {
  const loadExpenses = async () => {
    try {
      const response = await fetch(`${API}/expenses`);
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError("Could not connect to server. Is it running?");
    } finally {
      setLoading(false);
    }
  };
  loadExpenses();
}, []); // empty array means this runs once on mount

  const totalsMap = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) acc[expense.category] = 0;
    acc[expense.category] += Number(expense.amount);
    return acc;
  }, {});

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: totalsMap[cat.id] || 0,
  })).filter((cat) => cat.total > 0);

  const chartData = categoryTotals.map((cat) => ({
    name: cat.label,
    value: cat.total
  }));

  const sortedExpenses = expenses.toSorted((a, b) => new Date(b.date) - new Date(a.date));
  const uniqueMonths = [...new Set(sortedExpenses.map(exp => exp.date?.slice(0, 7)))];

  const monthFilteredExpenses = selectedMonth
    ? sortedExpenses.filter(exp => exp.date.slice(0, 7) === selectedMonth)
    : sortedExpenses;

  const expensesToShow = activeCategory
    ? monthFilteredExpenses.filter(exp => exp.category === activeCategory)
    : monthFilteredExpenses;

  const addExpense = async (expense) => {
    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense)
    });
    setExpenses(prev => [...prev, expense]);
  };

  const deleteExpense = async (id) => {
    await fetch(`${API}/expenses/${id}`, {
      method: "DELETE"
    });
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleSaveEdit = async (updatedExpense) => {
    await fetch(`${API}/expenses/${updatedExpense.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense)
    });
    setExpenses(prev =>
      prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
    );
    setEditingExpense(null);
  };

  const clearFilters = () => { setActiveCategory(null); setSelectedMonth(null); };

if (loading) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading expenses...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-center text-slate-800 border-b-2 border-indigo-500 pb-3 mb-6">
          Expense Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:items-start">
          <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <Balance expenses={expenses} />
            <ExpenseForm
              onAddExpense={addExpense}
              categories={CATEGORIES}
              onClearFilter={() => setActiveCategory(null)}
            />
          </div>

          <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <CategoryPieChart data={chartData} />
            <CategoryTotals categoryTotals={categoryTotals} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <FilterBar
            months={uniqueMonths}
            categories={categoryTotals}
            selectedMonth={selectedMonth}
            selectedCategory={activeCategory}
            onChangeMonth={setSelectedMonth}
            onChangeCategory={setActiveCategory}
            onClearFilters={clearFilters}
          />
          <ExpenseList
            expenses={expenses}
            onDelete={deleteExpense}
            onEdit={setEditingExpense}
            categoryMap={CATEGORY_MAP}
            expensesToShow={expensesToShow}
            onCategoryClick={setActiveCategory}
            activeCategory={activeCategory}
          />
        </div>
      </div>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleSaveEdit}
          onCancel={() => setEditingExpense(null)}
          categories={CATEGORIES}
        />
      )}
    </div>
  );
}