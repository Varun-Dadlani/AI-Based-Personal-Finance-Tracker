import AddCategory from "./AddCategory";

export default function EditCategoryModal({
  category,
  onClose,
  onUpdated
}) {
  if (!category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Edit Category</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <AddCategory
          editData={category}
          onAdd={() => {
            onUpdated();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
