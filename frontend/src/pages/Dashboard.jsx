import { useEffect, useState } from "react";
import api from "../api/api";
import useUserAuth from "../auth/useUserAuth";
import TransactionList from "../components/TransactionList";
import AddCategory from "../components/AddCategory";
import AddTransaction from "../components/AddTransaction";
import TransactionFilter from "../components/TransactionFilter";
import StatCard from "../components/StatCard";
import {
  categoryAnalytics,
  paymentAnalytics,
  monthlyAnalytics
} from "../utils/analytics";

import CategoryPie from "../components/charts/CategoryPie";
import PaymentPie from "../components/charts/PaymentPie";
import MonthlyBar from "../components/charts/MonthlyBar";
import EditTransactionModal from "../components/EditTransactionModal";

export default function Dashboard({onTransactionReferesh}) {
  const { authenticated } = useUserAuth();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingTx, setEditingTx] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    categoryId: "",
    paymentMethod: ""
  });

  /* ---------------- FETCH DATA ---------------- */

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const loadTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data);
    onTransactionReferesh();
  };
  
  useEffect(() => {
    if (!authenticated) return;
    loadCategories();
    loadTransactions();
  }, [authenticated]);

 

  /* ---------------- FILTER LOGIC (SINGLE SOURCE OF TRUTH) ---------------- */

  const filteredTransactions = transactions.filter(tx => {
    if (filters.startDate && tx.transaction_date < filters.startDate) return false;
    if (filters.endDate && tx.transaction_date > filters.endDate) return false;
    if (filters.categoryId && tx.category.id !== Number(filters.categoryId)) return false;
    if (filters.paymentMethod && tx.payment_method !== filters.paymentMethod) return false;
    return true;
  });

  if (!authenticated) return null;

  const totalIncome = filteredTransactions
  .filter(tx => tx.category.type === "income")
  .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter(tx => tx.category.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;
  const showPaymentChart = !filters.paymentMethod;

  const deleteTransaction = async (tx) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    await api.delete(`/transactions/${tx.id}`);
    loadTransactions();
  }


  /* ---------------- UI ---------------- */


return (
  <>
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
  <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
    Dashboard
  </h2>

  {/* STATS */}
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard title="Total Income" value={totalIncome} color="text-green-600" />
    <StatCard title="Total Expense" value={totalExpense} color="text-red-600" />
    <StatCard title="Balance" value={balance} color="text-blue-600" />
  </section>

  {/* FILTER */}
  <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
    <TransactionFilter
      filters={filters}
      setFilters={setFilters}
      categories={categories}
    />
  </section>

  {/* TRANSACTIONS */}
  <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
    <TransactionList
      transactions={filteredTransactions}
      onEdit={setEditingTx}
      onDelete={deleteTransaction}
    />
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
  </section>

  {/* FORMS */}
  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
      <AddTransaction categories={categories} onAdd={loadTransactions} />
    </div>
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
      <AddCategory className="mb-4"onAdd={loadCategories} />
      <div className="mb-6"></div>

    </div>
  </section>

  {/* ANALYTICS */}
  <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
      <CategoryPie data={categoryAnalytics(filteredTransactions)} />
    </div>

    {showPaymentChart && (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <PaymentPie data={paymentAnalytics(filteredTransactions)} />
      </div>
    )}

    <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow p-6">
      <MonthlyBar data={monthlyAnalytics(filteredTransactions)} />
    </div>
  </section>
</main>
</>

);




}
