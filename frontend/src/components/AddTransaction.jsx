import { useState, useEffect } from "react";
import api from "../api/api";

export default function AddTransaction({ categories, onAdd, editData = null }) {
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    payment_method: "",
    transaction_date: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        category_id: editData.category.id,
        amount: editData.amount,
        payment_method: editData.payment_method,
        transaction_date: editData.transaction_date
      });
    }
  }, [editData]);

  const submit = async () => {
    try {
      setLoading(true);
      if (editData) {
        await api.put(`/transactions/${editData.id}`, {
          ...form,
          amount: Number(form.amount)
        });
      } else {
        await api.post("/transactions", {
          ...form,
          amount: Number(form.amount)
        });
      }
      setForm({
        category_id: "",
        amount: "",
        payment_method: "",
        transaction_date: ""
      });
      onAdd();
    } finally {
      setLoading(false);
    }
  };

  const uploadBill = async (file) => {
  setLoadingOCR(true);
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/transactions/ocr", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    if (res.data.amount) {
      setForm({ ...form, amount: res.data.amount })
    }

    if (res.data.date) {
      setForm({ ...form, transaction_date: res.data.date })
    }
    if (res.data.payment_method){
      setForm({...form, payment_method:res.data.payment_method})
    }
    if (res.data.category){
      setForm({...form,category_id:res.data.category_id})
    }

  } catch (err) {
    alert("Failed to read bill"+ err);
  } finally {
    setLoadingOCR(false);
  }
};


  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-4">
        {editData ? "" : "Add New Transaction"}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="input-dark"
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          className="input-dark"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />

        <select
          className="input-dark"
          value={form.payment_method}
          onChange={e => setForm({ ...form, payment_method: e.target.value })}
        >
          <option value="">Payment Method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>

        <input
          type="date"
          className="input-dark"
          value={form.transaction_date}
          onChange={e => setForm({ ...form, transaction_date: e.target.value })}
        />
      </div>

      <div className="flex justify-end">
        <button
          className="btn-primary disabled:opacity-50"
          disabled={
            loading ||
            !form.category_id ||
            !form.amount ||
            !form.payment_method ||
            !form.transaction_date
          }
          onClick={submit}
        >
          {loading ? "Saving..." : editData ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>
      <div className="mt-4">
  <label className="block text-sm font-medium mb-1">
    Upload Bill (optional)
  </label>

  <input
  type="file"
  accept="image/*,application/pdf"
  onChange={(e) => uploadBill(e.target.files[0])}
  className="block w-full text-sm"
/>


  {loadingOCR && (
    <p className="text-sm text-blue-500 mt-1">
      Reading bill...
    </p>
  )}
</div>

      
    </div>
  );
}
