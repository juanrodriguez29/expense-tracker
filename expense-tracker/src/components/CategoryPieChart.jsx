import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer, Sector } from "recharts";
import { useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF5C5C", "#00B0FF", "#FF8C42"];

export function CategoryPieChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) return <p>No expenses to display</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={50}
            activeIndex={activeIndex}
            activeShape={(props) => (
              <g>
                <text x={props.cx} y={props.cy} dy={8} textAnchor="middle" fill="#000" fontWeight="bold">
                  {props.name}
                </text>
                <Sector
                  cx={props.cx}
                  cy={props.cy}
                  innerRadius={props.innerRadius}
                  outerRadius={props.outerRadius + 10} // grows slice by 10px
                  startAngle={props.startAngle}
                  endAngle={props.endAngle}
                  fill={props.fill}
                />
              </g>
            )}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}