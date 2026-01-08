import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import "./ExpenseModal.css";

export function EditExpenseModal({ expense, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount);
    }
  }, [expense]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSave = () => {
    onSave({
      ...expense,
      title,
      amount: Number(amount),
    });
  };

  return (
    createPortal(
      <div className="modal-backdrop" onClick={onCancel}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Edit Expense</h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Expense title"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <div className="modal-actions">
            <button className="save-button"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              Save
            </button>

            <button
              className="cancel-button"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    , document.getElementById("modal-root"))
  );
}