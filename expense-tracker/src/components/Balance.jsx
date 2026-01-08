import "./Balance.css";

export function Balance({ expenses }) {
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return <div className="balance">Total: ${total.toFixed(2)}</div>;
}