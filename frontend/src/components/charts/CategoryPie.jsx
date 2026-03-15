import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#b1c854ff", "#1b5046ff","#0088FE" ,"#A28CFE", "#FF6B6B", "#6BCB77"];

export default function CategoryPie({ data }) {
  return (
    <div>
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        {data.length === 0 ? (
          <div>No data available</div>
        ) : (
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
        )}
    </div>
  );
}
