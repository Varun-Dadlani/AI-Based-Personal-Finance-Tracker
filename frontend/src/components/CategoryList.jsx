import {getCategoryIcon} from "../utils/categoryIcon";


export default function CategoryList({ categories , onEdit , onDelete}) {

  if(categories.length === 0){
    return(
      <p className="text-center text-gray-500">
        No categories added yet.
      </p>
    )
  } 
  
  return (
    <div className="divide-y dark:divide-slate-700">
      {categories.map(cat => {
        const Icon = getCategoryIcon(cat.icon);

        return (
          <div
            key={cat.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-slate-700">
                <Icon size={18} className="text-blue-600 dark:text-blue-300" />
              </div>

              <div>
                <p className="font-medium">{cat.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full
                  ${cat.type === "income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                  {cat.type}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="text-blue-500" onClick={() => onEdit(cat)}>Edit</button>
              <button className="text-red-500" onClick={() => onDelete(cat)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );

  
}