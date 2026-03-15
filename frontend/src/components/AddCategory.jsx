import { useState, useEffect } from "react";
import api from "../api/api";
import IconPicker from "../components/IconPicker";

export default function AddCategory({ onAdd, editData = null }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const isEditMode = Boolean(editData);
  const [icon, setIcon] = useState("");
  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setType(editData.type);
    } else {
      setName("");
      setType("expense");
    }
  }, [editData]);

  const submit = async () => {
    if (isEditMode) {
      await api.put(`/categories/${editData.id}`, { name, type, icon });
    } else {
      await api.post("/categories", { name, type, icon });
    }
    setName("");
    setType("expense");
    setIcon("");
    onAdd();
  };

  return (
  <div className="space-y-5">
    {/* Heading */}
    {!isEditMode && (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Add New Category
      </h3>
    )}

    {/* Inputs row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <input
        className="input-dark"
        placeholder="Category name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <select
        className="input-dark"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button
        className="btn-primary w-full disabled:opacity-50"
        onClick={submit}
        disabled={name.trim() === ""}
      >
        {isEditMode ? "Update" : "Add"}
      </button>
    </div>

    {/* Icon Picker (FULL WIDTH) */}
    <div>
      <IconPicker value={icon} onChange={setIcon} />
    </div>
  </div>
);

}
