"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", contacts: 850 },
  { month: "Feb", contacts: 920 },
  { month: "Mar", contacts: 1050 },
  { month: "Apr", contacts: 1180 },
  { month: "May", contacts: 1234 },
  { month: "Jun", contacts: 1350 },
];

export function ContactsGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          formatter={(value: number) => [value.toLocaleString(), "Contacts"]}
        />
        <Area
          type="monotone"
          dataKey="contacts"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#colorContacts)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

