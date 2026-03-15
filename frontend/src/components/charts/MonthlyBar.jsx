import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyBar({ data }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
      {data.length === 0 ? (
        <div>No data available</div>
      ) : (

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#dc5aa4ff" />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>

  );
}
