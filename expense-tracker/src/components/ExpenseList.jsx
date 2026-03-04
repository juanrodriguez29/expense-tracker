import { ExpenseItem } from "./ExpenseItem";
pwd
export function ExpenseList({ expenses, onDelete, onEdit, categoryMap, onCategoryClick, expensesToShow, activeCategory }) {
  return (
    <ul className="expense-list">
      
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

