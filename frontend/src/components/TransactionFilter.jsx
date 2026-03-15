export default function TransactionFilter({ filters, setFilters, categories }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="input-dark"
            value={filters.startDate}
            onChange={e =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">
            End Date
          </label>
          <input
            type="date"
            className="input-dark"
            value={filters.endDate}
            onChange={e =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">
            Category
          </label>
          <select
            className="input-dark"
            value={filters.categoryId}
            onChange={e =>
              setFilters({ ...filters, categoryId: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">
            Payment Method
          </label>
          <select
            className="input-dark"
            value={filters.paymentMethod}
            onChange={e =>
              setFilters({ ...filters, paymentMethod: e.target.value })
            }
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
      </div>
    </div>
  );
}
