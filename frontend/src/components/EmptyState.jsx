export default function EmptyState({ message }) {
  return (
    <div className="flex items-center justify-center h-48 text-gray-500">
      <p className="text-sm">{message}</p>
    </div>
  );
}
