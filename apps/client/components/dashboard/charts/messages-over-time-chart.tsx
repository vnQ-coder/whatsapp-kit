"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", sent: 1200, delivered: 1150, read: 980 },
  { month: "Feb", sent: 1900, delivered: 1820, read: 1650 },
  { month: "Mar", sent: 2800, delivered: 2700, read: 2450 },
  { month: "Apr", sent: 3200, delivered: 3100, read: 2900 },
  { month: "May", sent: 3800, delivered: 3650, read: 3400 },
  { month: "Jun", sent: 4200, delivered: 4050, read: 3800 },
];

export function MessagesOverTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
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
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="circle"
        />
        <Line
          type="monotone"
          dataKey="sent"
          stroke="hsl(var(--message-sent))"
          strokeWidth={2}
          name="Sent"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="delivered"
          stroke="hsl(var(--message-delivered))"
          strokeWidth={2}
          name="Delivered"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="read"
          stroke="hsl(var(--message-read))"
          strokeWidth={2}
          name="Read"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

