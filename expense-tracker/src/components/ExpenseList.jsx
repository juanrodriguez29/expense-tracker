import { ExpenseItem } from "./ExpenseItem";

import "./ExpenseList.css"

export function ExpenseList({ expenses, onDelete, onEdit, categoryMap, onCategoryClick, expensesToShow, activeCategory }) {
  return (
    <ul className="expense-list">
      {activeCategory !== null &&
        (< button className="clear-filter" onClick={() => onCategoryClick(null)}>Clear</button>
        )}
      {expensesToShow.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDelete={onDelete}
          onEdit={onEdit}
          categoryMap={categoryMap}
          onCategoryClick={onCategoryClick}
        />))}
    </ul>
  );
}