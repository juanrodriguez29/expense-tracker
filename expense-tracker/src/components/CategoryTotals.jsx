import { useState } from 'react';
import "./CategoryTotals.css";

export function CategoryTotals({ expenses, categories, expensesToShow }) {

  const totals = categories.map((category) => {
    const forThisCategory = expenses.filter((expense) => expense.category === category.id).reduce((sum, expense) =>  sum +  Number(expense.amount), 0);
    return forThisCategory;
  });

  const combinedCategories = categories.map((category,  index) => {
    return { ...category, total: totals[index] };
  });

  const filteredCategories = combinedCategories.filter((cat) => cat.total > 0);

  return (
    <div className="category-totals">
      {expensesToShow.length === 0
        ? null
        :filteredCategories.map((category) => <><span className="category-label">{category.label} :</span><span className="category-total">${category.total}</span></>)
      }
    </div>
  )
}