import "./ExpenseItem.css";

export function ExpenseItem({ expense, onDelete, onEdit }) {
  return (
    <li className="expense-item">
      <span className="expense-name">{expense.title}</span>
      <span className="expense-amount">${expense.amount}</span>
      <button className="edit-button" onClick={() => onEdit(expense)}>Edit</button>
      <button className="delete-button" onClick={() => onDelete(expense.id)}>Delete</button>
    </li>
  );
}