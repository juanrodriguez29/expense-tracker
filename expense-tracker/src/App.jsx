console.log('API URL:', import.meta.env.VITE_API_URL);

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
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

function Home({ expenses, editingExpense, setEditingExpense, addExpense, deleteExpense, handleSaveEdit, categoryTotals, chartData, uniqueMonths, expensesToShow, selectedMonth, setSelectedMonth, activeCategory, setActiveCategory, clearFilters, handleLogout, token, setToken }) {
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
  )
};

function AppRoutes() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        navigate('/');
      } else {
        navigate('/login');
      }
      setToken(session?.access_token);
    }
    checkUser();
  }, []);

    const handleLogin = async (email, password) => {
      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.log('Supabase login error:', error);
        alert('Login failed. Please check your credentials and try again.');
      } else {
        setToken(data.session.access_token);
        navigate('/');
      }

    }


  const handleSignUp = async (email, password) => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log('Supabase sign-up error:', error);
      alert('Sign-up failed. Please try again.');
    } else {
      alert('Sign-up successful! Please log in.');
      navigate('/login');
    }
  }


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Load expenses from the server when the app first opens
  /*useEffect(() => {
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
  }, []);*/ // empty array means this runs once on mount

  useEffect(() => {
  const loadExpenses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      const response = await fetch(`${API}/expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
}, []);

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
  const response = await fetch(`${API}/expenses`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(expense)
  });
  const data = await response.json();
  setExpenses(prev => [...prev, data]); // use returned data with real id
};

  const deleteExpense = async (id) => {
  await fetch(`${API}/expenses/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  setExpenses(prev => prev.filter(exp => exp.id !== id));
};


const handleSaveEdit = async (updatedExpense) => {
  await fetch(`${API}/expenses/${updatedExpense.id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
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
    <Routes>
      <Route
        path="/"
        element={
          <Home
            expenses={expenses}
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
            addExpense={addExpense}
            deleteExpense={deleteExpense}
            handleSaveEdit={handleSaveEdit}
            categoryTotals={categoryTotals}
            chartData={chartData}
            uniqueMonths={uniqueMonths}
            expensesToShow={expensesToShow}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            clearFilters={clearFilters}
            handleLogout={handleLogout}
            token={token}
            setToken={setToken}
          />}
      />
      <Route path="/login" element={<Login handleLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp handleSignUp={handleSignUp} />} />

    </Routes>
  )


};

export default function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}