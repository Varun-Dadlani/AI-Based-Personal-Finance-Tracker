// frontend/src/pages/Category.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import AddCategory from "../components/AddCategory";
import CategoryList from "../components/CategoryList";
import EditCategoryModal from "../components/EditCategoryModal";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingCat, setEditingCat] = useState(null);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };
  
  const deleteCategory = async (category) => {
    if(window.confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)){
      try{
      await api.delete(`/categories/${category.id}`);
      loadCategories();
    }
    catch(error){
      alert(error.response.data.detail || "Failed to delete category.");
    }
  }
  };

  
  useEffect(() => {
    loadCategories();
  }, []);


  return (
    <div>
      <div className="mb-8">
      <h2 className="text-3xl font-bold text-blue-600">
        Category
      </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <AddCategory onAdd={loadCategories} />
      </div>
      <div className="my-6"></div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <CategoryList categories={categories} onEdit={setEditingCat} onDelete={deleteCategory}/>
        {editingCat && (
          <EditCategoryModal
            category={editingCat} 
            onClose={() => setEditingCat(null)}
            onUpdated={loadCategories}
          />
        )}
      </div>
    </div>
  );
}