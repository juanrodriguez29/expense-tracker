import { ExpenseItem } from "./ExpenseItem";

import "./ExpenseList.css"

export function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <ul className="expense-list"> 
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}