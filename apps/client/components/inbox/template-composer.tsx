"use client";

import { useState } from "react";
import { X, Search, Send, MessageSquare, FileText } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";

interface Template {
  id: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  body: string;
  header?: string;
  footer?: string;
  buttons?: Array<{
    type: "PHONE_NUMBER" | "URL" | "QUICK_REPLY";
    text: string;
    url?: string;
    phoneNumber?: string;
  }>;
  status: "APPROVED" | "PENDING" | "REJECTED";
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "welcome_message",
    category: "UTILITY",
    language: "en",
    body: "Hello {{1}}, welcome to WhatsApp Kit! We're excited to have you on board.",
    header: "Welcome to WhatsApp Kit",
    status: "APPROVED",
  },
  {
    id: "2",
    name: "order_confirmation",
    category: "UTILITY",
    language: "en",
    body: "Hi {{1}}, your order #{{2}} has been confirmed. Expected delivery: {{3}}",
    status: "APPROVED",
  },
  {
    id: "3",
    name: "promotional_offer",
    category: "MARKETING",
    language: "en",
    body: "🎉 Special offer! Get {{1}}% off on all products. Use code: {{2}}. Valid until {{3}}",
    status: "APPROVED",
  },
  {
    id: "4",
    name: "appointment_reminder",
    category: "UTILITY",
    language: "en",
    body: "Reminder: Your appointment is scheduled for {{1}} at {{2}}. See you there!",
    status: "APPROVED",
  },
  {
    id: "5",
    name: "verification_code",
    category: "AUTHENTICATION",
    language: "en",
    body: "Your verification code is: {{1}}. Valid for 10 minutes.",
    status: "APPROVED",
  },
];

interface TemplateComposerProps {
  onClose: () => void;
  onSend: (templateId: string, recipient: string) => void;
}

export function TemplateComposer({ onClose, onSend }: TemplateComposerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [recipient, setRecipient] = useState("");
  const [templateParams, setTemplateParams] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const filteredTemplates = mockTemplates.filter(
    (template) =>
      template.status === "APPROVED" &&
      (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{(\d+)\}\}/g);
    return matches ? [...new Set(matches.map((m) => m.match(/\d+/)?.[0] || ""))] : [];
  };

  const renderTemplatePreview = (template: Template) => {
    let body = template.body;
    const variables = extractVariables(template.body);
    
    variables.forEach((varNum) => {
      const value = templateParams[varNum] || `{{${varNum}}}`;
      body = body.replace(new RegExp(`\\{\\{${varNum}\\}\\}`, "g"), value);
    });

    return body;
  };

  const handleSend = () => {
    if (!selectedTemplate || !recipient) {
      toast({
        title: "Error",
        description: "Please select a template and enter recipient phone number.",
        variant: "destructive",
      });
      return;
    }

    // Validate required parameters
    const variables = extractVariables(selectedTemplate.body);
    const missingParams = variables.filter(
      (v) => !templateParams[v] || templateParams[v].trim() === ""
    );

    if (missingParams.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in all template parameters: ${missingParams.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    onSend(selectedTemplate.id, recipient);
    toast({
      title: "Template sent!",
      description: `Sending ${selectedTemplate.name} to ${recipient}`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Send Template Message</DialogTitle>
          <DialogDescription>
            Initiate a conversation using a pre-approved WhatsApp template
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          {/* Template List */}
          <div className="w-1/2 border-r pr-4 flex flex-col">
            <div className="mb-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value="all"
                  onValueChange={() => {}}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="UTILITY">Utility</SelectItem>
                    <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted",
                      selectedTemplate?.id === template.id && "bg-muted border-primary"
                    )}
                    onClick={() => {
                      setSelectedTemplate(template);
                      const variables = extractVariables(template.body);
                      const newParams: Record<string, string> = {};
                      variables.forEach((v) => {
                        newParams[v] = templateParams[v] || "";
                      });
                      setTemplateParams(newParams);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{template.name}</h4>
                          <Badge
                            variant={
                              template.category === "MARKETING"
                                ? "default"
                                : template.category === "UTILITY"
                                ? "secondary"
                                : "outline"
                            }
                            className="mt-1 text-xs"
                          >
                            {template.category}
                          </Badge>
                        </div>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.body.replace(/\{\{\d+\}\}/g, "[Variable]")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Template Form */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedTemplate ? (
              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  <div>
                    <Label>Recipient Phone Number</Label>
                    <Input
                      placeholder="+1234567890"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Include country code (e.g., +1234567890)
                    </p>
                  </div>

                  <div>
                    <Label>Template: {selectedTemplate.name}</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      {selectedTemplate.header && (
                        <p className="font-semibold text-sm mb-2">
                          {selectedTemplate.header}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">
                        {renderTemplatePreview(selectedTemplate)}
                      </p>
                      {selectedTemplate.footer && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {selectedTemplate.footer}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Template Parameters</Label>
                    <div className="mt-2 space-y-2">
                      {extractVariables(selectedTemplate.body).map((varNum) => (
                        <div key={varNum}>
                          <Label className="text-xs">
                            Variable {varNum}
                          </Label>
                          <Input
                            placeholder={`Enter value for {{${varNum}}}`}
                            value={templateParams[varNum] || ""}
                            onChange={(e) =>
                              setTemplateParams({
                                ...templateParams,
                                [varNum]: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Select a template to configure</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!selectedTemplate || !recipient}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

