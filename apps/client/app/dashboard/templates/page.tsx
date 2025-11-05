"use client";

import { useState, Suspense, useMemo } from "react";
import { Plus, MessageSquare, Sparkles, Search } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/common/Button";
import { DataTable, Column } from "../../../components/common/DataTable";
import { Modal } from "../../../components/common/Modal";
import { useModal } from "../../../hooks/use-modal";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { EmptyState } from "../../../components/common/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { AdvancedFilter, FilterState } from "../../../components/common/AdvancedFilter";

interface Template {
  id: string;
  title: string;
  type: string;
  language: string;
  status: string;
  body: string;
}

// Mock data
const mockTemplates: Template[] = [
  {
    id: "1",
    title: "Welcome Message",
    type: "Marketing",
    language: "en",
    status: "Approved",
    body: "Welcome to our service! We're excited to have you.",
  },
  {
    id: "2",
    title: "Order Confirmation",
    type: "Transactional",
    language: "en",
    status: "Pending",
    body: "Your order #{{orderId}} has been confirmed.",
  },
];

const columns: Column<Template>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "language", header: "Language" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => (
      <Badge
        variant={row.status === "Approved" ? "success" : "warning"}
      >
        {row.status}
      </Badge>
    ),
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const createModal = useModal();
  const aiModal = useModal();
  const [formData, setFormData] = useState({
    title: "",
    type: "Marketing",
    language: "en",
    body: "",
  });
  const [aiPrompt, setAiPrompt] = useState({
    intent: "",
    tone: "Professional",
    type: "Marketing",
    language: "en",
  });
  const [aiVariations, setAiVariations] = useState<string[]>([]);

  const filterOptions = [
    {
      field: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "Approved", label: "Approved" },
        { value: "Pending", label: "Pending" },
        { value: "Rejected", label: "Rejected" },
      ],
    },
    {
      field: "type",
      label: "Category",
      type: "select" as const,
      options: [
        { value: "Marketing", label: "Marketing" },
        { value: "Transactional", label: "Transactional" },
        { value: "Utility", label: "Utility" },
      ],
    },
    {
      field: "language",
      label: "Language",
      type: "select" as const,
      options: [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
      ],
    },
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Search filter
      const matchesSearch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.body.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        !filters.status || template.status === filters.status;

      // Type filter
      const matchesType =
        !filters.type || template.type === filters.type;

      // Language filter
      const matchesLanguage =
        !filters.language || template.language === filters.language;

      return matchesSearch && matchesStatus && matchesType && matchesLanguage;
    });
  }, [templates, searchQuery, filters]);

  const handleCreate = () => {
    if (formData.title && formData.body) {
      const newTemplate: Template = {
        id: String(templates.length + 1),
        ...formData,
        status: "Pending",
      };
      setTemplates([...templates, newTemplate]);
      setFormData({ title: "", type: "Marketing", language: "en", body: "" });
      createModal.close();
    }
  };

  const handleGenerateAI = () => {
    // Simulate AI generation
    const variations = [
      `Hello! ${aiPrompt.intent}. We're here to help.`,
      `Hi there! ${aiPrompt.intent}. Looking forward to connecting with you.`,
      `Welcome! ${aiPrompt.intent}. Thanks for reaching out.`,
    ];
    setAiVariations(variations);
  };

  const handleSelectVariation = (variation: string) => {
    setFormData({ ...formData, body: variation });
    setAiVariations([]);
    aiModal.close();
    createModal.open();
  };

  const detectVariables = (text: string) => {
    const matches = text.match(/\{\{(\w+)\}\}/g);
    return matches || [];
  };

  const variables = detectVariables(formData.body);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Create and manage message templates"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={aiModal.open}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generator
            </Button>
            <Button onClick={createModal.open}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
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

      {filteredTemplates.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No templates yet"
          description="Create your first message template to get started"
          action={{
            label: "Create Template",
            onClick: createModal.open,
          }}
        />
      ) : (
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading templates..." />}>
          <DataTable
            data={filteredTemplates}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </Suspense>
      )}

      {/* Create Template Modal */}
      <Modal
        open={createModal.isOpen}
        onOpenChange={createModal.onOpenChange}
        title="Create Template"
        description="Create a new message template"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={createModal.close}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Template</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Welcome Message"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Transactional">Transactional</SelectItem>
                  <SelectItem value="Utility">Utility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) =>
                  setFormData({ ...formData, language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Message Body</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Type your message here..."
              rows={6}
              className="font-mono"
            />
          </div>
          {variables.length > 0 && (
            <div className="space-y-2">
              <Label>Detected Variables</Label>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable, index) => (
                  <Badge key={index} variant="secondary">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* AI Generator Modal */}
      <Modal
        open={aiModal.isOpen}
        onOpenChange={aiModal.onOpenChange}
        title="AI Template Generator"
        description="Generate message templates using AI"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={aiModal.close}>
              Cancel
            </Button>
            <Button onClick={handleGenerateAI}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intent">Intent / Purpose</Label>
            <Input
              id="intent"
              value={aiPrompt.intent}
              onChange={(e) =>
                setAiPrompt({ ...aiPrompt, intent: e.target.value })
              }
              placeholder="Welcome new customers"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={aiPrompt.tone}
                onValueChange={(value) =>
                  setAiPrompt({ ...aiPrompt, tone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-type">Type</Label>
              <Select
                value={aiPrompt.type}
                onValueChange={(value) =>
                  setAiPrompt({ ...aiPrompt, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Transactional">Transactional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {aiVariations.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <Label>Generated Variations</Label>
              <div className="grid gap-4">
                {aiVariations.map((variation, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelectVariation(variation)}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm">{variation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

