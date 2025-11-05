"use client";

import { Suspense } from "react";
import { Users, MessageSquare, Megaphone, TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/common/Button";
import { Plus } from "lucide-react";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { MessagesOverTimeChart } from "../../components/dashboard/charts/messages-over-time-chart";
import { DeliveryStatusChart } from "../../components/dashboard/charts/delivery-status-chart";
import { CampaignPerformanceChart } from "../../components/dashboard/charts/campaign-performance-chart";
import { ContactsGrowthChart } from "../../components/dashboard/charts/contacts-growth-chart";
import { MessageTrendsChart } from "../../components/dashboard/charts/message-trends-chart";

// Mock data
const stats = [
  {
    title: "Total Contacts",
    value: "1,234",
    description: "+12% from last month",
    icon: Users,
    color: "text-message-read",
  },
  {
    title: "Templates",
    value: "45",
    description: "+5 new templates",
    icon: MessageSquare,
    color: "text-message-delivered",
  },
  {
    title: "Active Campaigns",
    value: "8",
    description: "3 scheduled",
    icon: Megaphone,
    color: "text-primary",
  },
  {
    title: "Success Rate",
    value: "94.2%",
    description: "+2.1% improvement",
    icon: TrendingUp,
    color: "text-whatsapp-teal",
  },
];

const recentActivities = [
  { id: 1, action: "Campaign sent", target: "Marketing Campaign", time: "2 minutes ago" },
  { id: 2, action: "Template created", target: "Welcome Message", time: "1 hour ago" },
  { id: 3, action: "Contact added", target: "John Doe", time: "3 hours ago" },
  { id: 4, action: "Campaign completed", target: "Product Launch", time: "1 day ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your WhatsApp messaging platform"
        action={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium leading-none pr-2">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} shrink-0 flex-shrink-0`} />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.target}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
              <Button variant="outline" className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
              <Button variant="outline" className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
              <Button variant="outline" className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Over Time Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Messages Over Time</CardTitle>
          </div>
          <CardDescription>Sent, delivered, and read messages for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner text="Loading chart..." />}>
            <MessagesOverTimeChart />
          </Suspense>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Delivery Status Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Delivery Status</CardTitle>
            </div>
            <CardDescription>Message delivery breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner text="Loading chart..." />}>
              <DeliveryStatusChart />
            </Suspense>
          </CardContent>
        </Card>

        {/* Contacts Growth Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Contacts Growth</CardTitle>
            </div>
            <CardDescription>Total contacts growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner text="Loading chart..." />}>
              <ContactsGrowthChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Campaign Performance</CardTitle>
          </div>
          <CardDescription>Top 5 campaigns by message volume</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner text="Loading chart..." />}>
            <CampaignPerformanceChart />
          </Suspense>
        </CardContent>
      </Card>

      {/* Message Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Message Trends</CardTitle>
          </div>
          <CardDescription>Weekly message volume and average response time</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner text="Loading chart..." />}>
            <MessageTrendsChart />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
