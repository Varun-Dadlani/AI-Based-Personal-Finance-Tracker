import { CATEGORY_ICONS, ICON_KEYS } from "../utils/categoryIcon";

export default function IconPicker({ value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">
        Choose Icon
      </p>

      <div className="grid grid-cols-6 gap-3">
        {ICON_KEYS.map(key => {
          const Icon = CATEGORY_ICONS[key];
          const selected = value === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`
                flex items-center justify-center
                p-3 rounded-lg border
                transition
                ${selected
                  ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400"
                  : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                }
              `}
              title={key}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
