"use client";

import { useState } from "react";
import { Plus, FolderTree } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Modal } from "../../../components/common/Modal";
import { useModal } from "../../../hooks/use-modal";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { EmptyState } from "../../../components/common/EmptyState";

interface Group {
  id: string;
  name: string;
  type: "static" | "dynamic";
  contactCount: number;
  createdAt: string;
}

// Mock data
const mockGroups: Group[] = [
  {
    id: "1",
    name: "VIP Customers",
    type: "static",
    contactCount: 25,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Active Users",
    type: "dynamic",
    contactCount: 150,
    createdAt: "2024-01-20",
  },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const createModal = useModal();
  const [formData, setFormData] = useState({
    name: "",
    type: "static" as "static" | "dynamic",
  });

  const handleCreate = () => {
    if (formData.name) {
      const newGroup: Group = {
        id: String(groups.length + 1),
        ...formData,
        contactCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGroups([...groups, newGroup]);
      setFormData({ name: "", type: "static" });
      createModal.close();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Groups"
        description="Organize your contacts into groups"
        action={
          <Button onClick={createModal.open}>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        }
      />

      {groups.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No groups yet"
          description="Create your first contact group to get started"
          action={{
            label: "Create Group",
            onClick: createModal.open,
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{group.name}</CardTitle>
                  <Badge
                    variant={group.type === "static" ? "default" : "secondary"}
                  >
                    {group.type}
                  </Badge>
                </div>
                <CardDescription>
                  {group.contactCount} contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created {group.createdAt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={createModal.isOpen}
        onOpenChange={createModal.onOpenChange}
        title="Create Group"
        description="Create a new contact group"
        footer={
          <>
            <Button variant="outline" onClick={createModal.close}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Group</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VIP Customers"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Group Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "static" | "dynamic") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="dynamic">Dynamic</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.type === "static"
                ? "Manually add contacts to this group"
                : "Automatically add contacts based on filters"}
            </p>
          </div>
          {formData.type === "dynamic" && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label>Filter Builder</Label>
              <p className="text-sm text-muted-foreground">
                Configure dynamic filters (UI placeholder)
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

