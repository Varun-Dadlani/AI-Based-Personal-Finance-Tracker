import { getCategoryIcon} from "../utils/categoryIcon";
export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return <p className="text-center text-gray-400">No transactions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b dark:border-slate-700 text-left text-gray-500">
            <th className="py-2">Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Method</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(tx =>{
            const Icon = getCategoryIcon(tx.category.icon);
            return (
            <tr
              key={tx.id}
              className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <td className="py-2">{tx.transaction_date}</td>

              <td style={{display:'flex', alignItems:'center', gap:'0.5rem'}}><Icon size={30} className="p-2 rounded-lg bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-300" />{tx.category.name}</td>
              <td className="font-medium">₹ {tx.amount}</td>
              <td className="capitalize">{tx.payment_method}</td>
              <td className="text-right space-x-3">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => onEdit(tx)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => onDelete(tx)}
                >
                  Delete
                </button>
              </td>
            
            </tr>
        )})}
        </tbody>
      </table>
    </div>
  );
}
