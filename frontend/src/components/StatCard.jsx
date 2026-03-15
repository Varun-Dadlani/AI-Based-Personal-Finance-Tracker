export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>
        ₹ {value.toFixed(2)}
      </h2>
    </div>
  );
}
