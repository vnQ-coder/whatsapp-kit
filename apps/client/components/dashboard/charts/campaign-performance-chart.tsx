"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Product Launch", sent: 4500, delivered: 4300, read: 3800 },
  { name: "Marketing", sent: 3200, delivered: 3100, read: 2800 },
  { name: "Welcome", sent: 2800, delivered: 2750, read: 2600 },
  { name: "Promotion", sent: 2100, delivered: 2000, read: 1800 },
  { name: "Reminder", sent: 1800, delivered: 1750, read: 1600 },
];

export function CampaignPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="circle"
        />
        <Bar
          dataKey="sent"
          fill="hsl(var(--message-sent))"
          name="Sent"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="delivered"
          fill="hsl(var(--message-delivered))"
          name="Delivered"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="read"
          fill="hsl(var(--message-read))"
          name="Read"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

