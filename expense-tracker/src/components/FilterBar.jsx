
export function FilterBar({ months, categories, selectedMonth, selectedCategory, onChangeMonth, onChangeCategory, onClearFilters }) {

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + "-01");
    return date.toLocaleString("en-AU", { month: "short", year: "numeric" });
  };

  const isFiltering = selectedMonth || selectedCategory;

  const selectClass = "flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";

  return (
    <div className="flex flex-col gap-2 mb-4">

      <div className="flex gap-2">
        <select
          value={selectedMonth || ""}
          onChange={(e) => onChangeMonth(e.target.value)}
          className={selectClass}
        >
          <option value="">All months</option>
          {months.map(month => (
            <option key={month} value={month}>{formatMonth(month)}</option>
          ))}
        </select>

        <select
          value={selectedCategory || ""}
          onChange={(e) => onChangeCategory(e.target.value)}
          className={selectClass}
        >
          <option value="">All categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.label}</option>
          ))}
        </select>
      </div>

      {isFiltering && (
        <button
          onClick={onClearFilters}
          className="self-end text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          Clear filters ✕
        </button>
      )}

    </div>
  );
}




