import { useEffect, useState } from "react";
import api from "../api/api";
import TransactionList from "../components/TransactionList";
import AddTransaction from "../components/AddTransaction";
import EditTransactionModal from "../components/EditTransactionModal";

export default function Transaction({onTransactionReferesh}) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: "",
    payment_method: "",
    start_date: "",
    end_date: ""
  });
  const [editingTx, setEditingTx] = useState(null);

  /* ---------------- FETCH DATA ---------------- */

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const loadTransactions = async () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );

    const res = await api.get("/transactions", {
      params: cleanedFilters
    });

    setTransactions(res.data);
    onTransactionReferesh();
  };

  const exportCSV = async () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );

    const response = await api.get("/transactions/export/csv", {
      params: cleanedFilters,
      responseType: "blob"
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
};
  const deleteTransaction = async (tx) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    await api.delete(`/transactions/${tx.id}`);
    loadTransactions();
  }

  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div>
      
      <div className="mb-8">
      <h2 className="text-3xl font-bold text-blue-600">
        Transactions
      </h2>
      </div>

      {/* ---------- FILTERS ---------- */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 mb-6">
        <h4 className="font-semibold mb-4">Filters</h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="input-dark"
            value={filters.category_id}
            onChange={e =>
              setFilters({ ...filters, category_id: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="input-dark"
            value={filters.payment_method}
            onChange={e =>
              setFilters({ ...filters, payment_method: e.target.value })
            }
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          <input
            type="date"
            className="input-dark"
            value={filters.start_date}
            onChange={e =>
              setFilters({ ...filters, start_date: e.target.value })
            }
          />

          <input
            type="date"
            className="input-dark"
            value={filters.end_date}
            onChange={e =>
              setFilters({ ...filters, end_date: e.target.value })
            }
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={loadTransactions}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>

          <button
            onClick={() => {
              setFilters({
                category_id: "",
                payment_method: "",
                start_date: "",
                end_date: ""
              });
              loadTransactions();
            }}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Clear
          </button>

          <button
          className="border px-4 py-2 rounded hover:bg-gray-100"
          onClick={exportCSV}
          disabled={transactions.length === 0}
          > Export CSV</button>
        </div>
      </div>

      {/* ---------- TRANSACTION LIST ---------- */}
      

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 mb-6">
        <TransactionList transactions={transactions} onEdit={setEditingTx} onDelete={deleteTransaction}/>
      
      {editingTx && (
        <EditTransactionModal
          transaction={editingTx}
          categories={categories}
          onClose={() => setEditingTx(null)}
          onUpdated={() => {
            loadTransactions();
            setEditingTx(null);
          }}
        />
      )}
      </div>

      {/* ---------- ADD TRANSACTION ---------- */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <AddTransaction
          categories={categories}
          onAdd={loadTransactions}
        />
      </div>
    </div>
  );
}
