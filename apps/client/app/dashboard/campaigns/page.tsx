"use client";

import { useState, Suspense, useMemo } from "react";
import { Plus, Megaphone, Search } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/common/Button";
import { DataTable, Column } from "../../../components/common/DataTable";
import { Modal } from "../../../components/common/Modal";
import { useModal } from "../../../hooks/use-modal";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { EmptyState } from "../../../components/common/EmptyState";
import { Textarea } from "../../../components/ui/textarea";
import { AdvancedFilter, FilterState } from "../../../components/common/AdvancedFilter";

interface Campaign {
  id: string;
  name: string;
  template: string;
  group: string;
  schedule: string;
  status: string;
  sent: number;
  total: number;
}

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Product Launch",
    template: "Welcome Message",
    group: "VIP Customers",
    schedule: "2024-02-01 10:00",
    status: "Scheduled",
    sent: 0,
    total: 25,
  },
  {
    id: "2",
    name: "Monthly Newsletter",
    template: "Marketing Update",
    group: "All Users",
    schedule: "2024-01-30 09:00",
    status: "Completed",
    sent: 150,
    total: 150,
  },
];

const columns: Column<Campaign>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "template", header: "Template" },
  { accessorKey: "group", header: "Group" },
  { accessorKey: "schedule", header: "Schedule" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => (
      <Badge
        variant={
          row.status === "Completed"
            ? "success"
            : row.status === "Scheduled"
            ? "default"
            : "warning"
        }
      >
        {row.status}
      </Badge>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: (row) => `${row.sent}/${row.total}`,
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const createModal = useModal();
  const [formData, setFormData] = useState({
    name: "",
    template: "",
    group: "",
    schedule: "",
    throttle: "100",
    retries: "3",
  });

  const filterOptions = [
    {
      field: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "Draft", label: "Draft" },
        { value: "Scheduled", label: "Scheduled" },
        { value: "Running", label: "Running" },
        { value: "Completed", label: "Completed" },
        { value: "Paused", label: "Paused" },
      ],
    },
    {
      field: "template",
      label: "Template",
      type: "select" as const,
      options: [
        { value: "Welcome Message", label: "Welcome Message" },
        { value: "Marketing Update", label: "Marketing Update" },
        { value: "Order Confirmation", label: "Order Confirmation" },
      ],
    },
    {
      field: "group",
      label: "Target Group",
      type: "select" as const,
      options: [
        { value: "VIP Customers", label: "VIP Customers" },
        { value: "All Users", label: "All Users" },
        { value: "Active Users", label: "Active Users" },
      ],
    },
    {
      field: "schedule",
      label: "Schedule Date",
      type: "daterange" as const,
    },
  ];

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      // Search filter
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.group.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        !filters.status || campaign.status === filters.status;

      // Template filter
      const matchesTemplate =
        !filters.template || campaign.template === filters.template;

      // Group filter
      const matchesGroup =
        !filters.group || campaign.group === filters.group;

      // Schedule filter
      let matchesSchedule = true;
      if (filters.schedule && typeof filters.schedule === "object") {
        const dateRange = filters.schedule;
        if (dateRange.from || dateRange.to) {
          const scheduleDate = new Date(campaign.schedule);
          if (dateRange.from) {
            const fromDate = new Date(dateRange.from);
            if (scheduleDate < fromDate) matchesSchedule = false;
          }
          if (dateRange.to) {
            const toDate = new Date(dateRange.to);
            toDate.setHours(23, 59, 59, 999);
            if (scheduleDate > toDate) matchesSchedule = false;
          }
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesTemplate &&
        matchesGroup &&
        matchesSchedule
      );
    });
  }, [campaigns, searchQuery, filters]);

  const handleCreate = () => {
    if (formData.name && formData.template && formData.group) {
      const newCampaign: Campaign = {
        id: String(campaigns.length + 1),
        name: formData.name,
        template: formData.template,
        group: formData.group,
        schedule: formData.schedule || "Immediate",
        status: formData.schedule ? "Scheduled" : "Draft",
        sent: 0,
        total: 0,
      };
      setCampaigns([...campaigns, newCampaign]);
      setFormData({
        name: "",
        template: "",
        group: "",
        schedule: "",
        throttle: "100",
        retries: "3",
      });
      createModal.close();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Create and manage messaging campaigns"
        action={
          <Button onClick={createModal.open}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <AdvancedFilter
            options={filterOptions}
            filters={filters}
            onFiltersChange={setFilters}
            onClear={() => setFilters({})}
          />
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create your first campaign to start messaging"
          action={{
            label: "Create Campaign",
            onClick: createModal.open,
          }}
        />
      ) : (
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading campaigns..." />}>
          <DataTable
            data={filteredCampaigns}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </Suspense>
      )}

      <Modal
        open={createModal.isOpen}
        onOpenChange={createModal.onOpenChange}
        title="Create Campaign"
        description="Create a new messaging campaign"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={createModal.close}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Campaign</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Product Launch"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={formData.template}
                onValueChange={(value) =>
                  setFormData({ ...formData, template: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Welcome Message">Welcome Message</SelectItem>
                  <SelectItem value="Marketing Update">Marketing Update</SelectItem>
                  <SelectItem value="Order Confirmation">Order Confirmation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Target Group</Label>
              <Select
                value={formData.group}
                onValueChange={(value) =>
                  setFormData({ ...formData, group: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP Customers">VIP Customers</SelectItem>
                  <SelectItem value="All Users">All Users</SelectItem>
                  <SelectItem value="Active Users">Active Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule (Optional)</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={formData.schedule}
              onChange={(e) =>
                setFormData({ ...formData, schedule: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to send immediately
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="throttle">Throttle (messages/min)</Label>
              <Input
                id="throttle"
                type="number"
                value={formData.throttle}
                onChange={(e) =>
                  setFormData({ ...formData, throttle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retries">Max Retries</Label>
              <Input
                id="retries"
                type="number"
                value={formData.retries}
                onChange={(e) =>
                  setFormData({ ...formData, retries: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

