
export function ExpenseItem({ expense, onDelete, onEdit, categoryMap, onCategoryClick }) {
  return (
    <li
      onClick={() => onEdit(expense)}
      className="flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all duration-150 group"
    >
      
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-semibold text-slate-800 truncate">{expense.title}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onCategoryClick(expense.category); }}
          className="self-start mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
        >
          {categoryMap[expense.category]}
        </button>
      </div>

      
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="font-bold text-slate-800 tabular-nums">${Number(expense.amount).toFixed(2)}</span>
        <span className="text-xs text-slate-400">{expense.date}</span>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
        className="shrink-0 opacity-0 group-hover:opacity-100 ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
      >
        ✕
      </button>
    </li>
  );
}