
export function Balance({ expenses }) {
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount), 0
  );

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">
        Total Spent
      </p>
      <p className="text-4xl font-bold text-indigo-600">
        {new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(total)}
      </p>
    </div>
  );
}