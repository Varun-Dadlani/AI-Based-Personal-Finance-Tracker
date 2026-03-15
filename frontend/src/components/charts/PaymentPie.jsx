import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#c9f047ff", "#82ca9d", "#ffc658", "#8c44e3ff", "#227640ff", "#ff6b6b", "#6bcb77"];

export default function PaymentPie({ data }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Payment Method Usage</h3>
      {data.length === 0 ? (<div>No data available</div>) : (
      <>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      </>
      )}
    </div>
    
  );
}
