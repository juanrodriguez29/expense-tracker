import "./ExpenseItem.css";

export function ExpenseItem({ expense, onDelete, onEdit, categoryMap, onCategoryClick }) {
  return (
    <li className="expense-item">
      <span className="expense-name">{expense.title}</span>
      <button className="expense-category" onClick={() => onCategoryClick(expense.category)}>{categoryMap[expense.category]}</button>
      <span className="expense-amount">${expense.amount}</span>
      <div className="expense-actions">
        <button className="edit-button" onClick={() => onEdit(expense)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(expense.id)}>Delete</button>
      </div>
    </li>
  );
}