
export function CategoryTotals({ categoryTotals }) {

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(value);

  if (categoryTotals.length === 0) {
    return <p className="text-center text-slate-400 text-sm py-4">No expenses yet</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:items-start">
      {categoryTotals.map((category) => (
        <div key={category.id} className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-600">{category.label}</span>
          <span className="text-sm font-bold text-slate-800 tabular-nums">{formatCurrency(category.total)}</span>
        </div>
      ))}
    </div>
  );
}