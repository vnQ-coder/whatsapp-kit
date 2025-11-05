"use client";

import { useState, Suspense, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/common/Button";
import { DataTable, Column } from "../../../components/common/DataTable";
import { Input } from "../../../components/ui/input";
import { Modal } from "../../../components/common/Modal";
import { useModal } from "../../../hooks/use-modal";
import { Label } from "../../../components/ui/label";
import { EmptyState } from "../../../components/common/EmptyState";
import { Users } from "lucide-react";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { AdvancedFilter, FilterState } from "../../../components/common/AdvancedFilter";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+1234567890",
    email: "john@example.com",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+1234567891",
    email: "jane@example.com",
    status: "Active",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    phone: "+1234567892",
    email: "bob@example.com",
    status: "Inactive",
    createdAt: "2024-01-25",
  },
];

const columns: Column<Contact>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === "Active"
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  { accessorKey: "createdAt", header: "Created" },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const addModal = useModal();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const filterOptions = [
    {
      field: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    {
      field: "createdAt",
      label: "Created Date",
      type: "daterange" as const,
    },
    {
      field: "email",
      label: "Email Domain",
      type: "text" as const,
      placeholder: "e.g., @example.com",
    },
  ];

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Search filter
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        !filters.status || contact.status === filters.status;

      // Date range filter
      let matchesDate = true;
      if (filters.createdAt && typeof filters.createdAt === "object") {
        const dateRange = filters.createdAt;
        if (dateRange.from || dateRange.to) {
          const contactDate = new Date(contact.createdAt);
          if (dateRange.from) {
            const fromDate = new Date(dateRange.from);
            if (contactDate < fromDate) matchesDate = false;
          }
          if (dateRange.to) {
            const toDate = new Date(dateRange.to);
            toDate.setHours(23, 59, 59, 999); // Include entire day
            if (contactDate > toDate) matchesDate = false;
          }
        }
      }

      // Email domain filter
      let matchesEmail = true;
      if (filters.email && typeof filters.email === "string") {
        matchesEmail = contact.email
          .toLowerCase()
          .includes(filters.email.toLowerCase());
      }

      return matchesSearch && matchesStatus && matchesDate && matchesEmail;
    });
  }, [contacts, searchQuery, filters]);

  const handleAdd = () => {
    if (formData.name && formData.phone) {
      const newContact: Contact = {
        id: String(contacts.length + 1),
        ...formData,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setContacts([...contacts, newContact]);
      setFormData({ name: "", phone: "", email: "" });
      addModal.close();
    }
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    });
    addModal.open();
  };

  const handleDelete = (contact: Contact) => {
    setContacts(contacts.filter((c) => c.id !== contact.id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage your WhatsApp contacts"
        action={
          <Button onClick={addModal.open}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
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

      {filteredContacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts found"
          description="Get started by adding your first contact"
          action={{
            label: "Add Contact",
            onClick: addModal.open,
          }}
        />
      ) : (
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading contacts..." />}>
          <DataTable
            data={filteredContacts}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            keyExtractor={(row) => row.id}
          />
        </Suspense>
      )}

      <Modal
        open={addModal.isOpen}
        onOpenChange={addModal.onOpenChange}
        title="Add Contact"
        description="Add a new contact to your list"
        footer={
          <>
            <Button variant="outline" onClick={addModal.close}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Contact</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1234567890"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

