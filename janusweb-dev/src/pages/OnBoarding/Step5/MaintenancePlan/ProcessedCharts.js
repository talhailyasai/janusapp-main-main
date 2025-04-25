import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const ProcessedCharts = ({ data }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="Year" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} width={80} />
          <Tooltip
            cursor={{ fill: "rgba(43, 67, 75, 0.1)" }}
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="Total_Cost"
            fill="#2b434b"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProcessedCharts;
