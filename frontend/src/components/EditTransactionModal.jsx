import AddTransaction from "./AddTransaction";

export default function EditTransactionModal({
  transaction,
  categories,
  onClose,
  onUpdated
}) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Transaction</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <AddTransaction
          categories={categories}
          editData={transaction}
          onAdd={() => {
            onUpdated();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
