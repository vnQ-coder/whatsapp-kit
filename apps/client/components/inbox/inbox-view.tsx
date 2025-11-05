"use client";

import { useState, useMemo } from "react";
import { Search, MessageSquare, Users, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../common/Button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ConversationList } from "./conversation-list";
import { ChatWindow } from "./chat-window";
import { TemplateComposer } from "./template-composer";
import { AdvancedFilter, FilterState } from "../common/AdvancedFilter";
import { cn } from "../../lib/utils";

export type ConversationType = "individual" | "group";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  status: MessageStatus;
  type: "text" | "image" | "video" | "document" | "template";
  mediaUrl?: string;
  templateName?: string;
}

export interface Conversation {
  id: string;
  name: string;
  type: ConversationType;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  avatar?: string;
  participants?: string[];
  phoneNumber?: string;
  isOnline?: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "John Doe",
    type: "individual",
    lastMessage: "Thanks for the update!",
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 2,
    phoneNumber: "+1234567890",
    isOnline: true,
  },
  {
    id: "2",
    name: "Marketing Team",
    type: "group",
    lastMessage: "Sarah: The campaign is ready",
    lastMessageTime: new Date(Date.now() - 15 * 60000),
    unreadCount: 5,
    participants: ["Sarah", "Mike", "John", "You"],
  },
  {
    id: "3",
    name: "Jane Smith",
    type: "individual",
    lastMessage: "I'll check and get back to you",
    lastMessageTime: new Date(Date.now() - 30 * 60000),
    unreadCount: 0,
    phoneNumber: "+1234567891",
    isOnline: false,
  },
  {
    id: "4",
    name: "Product Launch Group",
    type: "group",
    lastMessage: "Mike: Launch scheduled for tomorrow",
    lastMessageTime: new Date(Date.now() - 60 * 60000),
    unreadCount: 1,
    participants: ["Mike", "Sarah", "Tom", "You"],
  },
  {
    id: "5",
    name: "Support Team",
    type: "group",
    lastMessage: "Tom: All tickets resolved",
    lastMessageTime: new Date(Date.now() - 120 * 60000),
    unreadCount: 0,
    participants: ["Tom", "Alice", "Bob", "You"],
  },
];

export function InboxView() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "individual" | "group">("all");
  const [filters, setFilters] = useState<FilterState>({});
  const [showTemplateComposer, setShowTemplateComposer] = useState(false);

  const filterOptions = [
    {
      field: "unread",
      label: "Unread Messages",
      type: "select" as const,
      options: [
        { value: "has-unread", label: "Has Unread" },
        { value: "no-unread", label: "No Unread" },
      ],
    },
    {
      field: "online",
      label: "Online Status",
      type: "select" as const,
      options: [
        { value: "online", label: "Online" },
        { value: "offline", label: "Offline" },
      ],
    },
    {
      field: "lastMessage",
      label: "Last Message",
      type: "daterange" as const,
    },
  ];

  const filteredConversations = useMemo(() => {
    return mockConversations.filter((conv) => {
      // Search filter
      const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesFilter = filterType === "all" || conv.type === filterType;

      // Unread filter
      let matchesUnread = true;
      if (filters.unread === "has-unread") {
        matchesUnread = conv.unreadCount > 0;
      } else if (filters.unread === "no-unread") {
        matchesUnread = conv.unreadCount === 0;
      }

      // Online status filter (only for individual conversations)
      let matchesOnline = true;
      if (filters.online && conv.type === "individual") {
        if (filters.online === "online") {
          matchesOnline = conv.isOnline === true;
        } else if (filters.online === "offline") {
          matchesOnline = conv.isOnline === false;
        }
      }

      // Last message date filter
      let matchesDate = true;
      if (filters.lastMessage && typeof filters.lastMessage === "object" && conv.lastMessageTime) {
        const dateRange = filters.lastMessage;
        if (dateRange.from || dateRange.to) {
          const messageDate = new Date(conv.lastMessageTime);
          if (dateRange.from) {
            const fromDate = new Date(dateRange.from);
            if (messageDate < fromDate) matchesDate = false;
          }
          if (dateRange.to) {
            const toDate = new Date(dateRange.to);
            toDate.setHours(23, 59, 59, 999);
            if (messageDate > toDate) matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesFilter && matchesUnread && matchesOnline && matchesDate;
    });
  }, [searchQuery, filterType, filters]);

  return (
    <div className="flex h-full rounded-lg border bg-card overflow-hidden">
      {/* Left Sidebar - Conversations List */}
      <div className="w-full md:w-96 border-r flex flex-col bg-background">
        {/* Header */}
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Conversations</h2>
            <Button
              size="sm"
              onClick={() => setShowTemplateComposer(true)}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter Tabs */}
          <div className="space-y-3">
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="individual" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Individual
                </TabsTrigger>
                <TabsTrigger value="group" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Groups
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Advanced Filters */}
            <AdvancedFilter
              options={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
              onClear={() => setFilters({})}
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </ScrollArea>
      </div>

      {/* Right Side - Chat Window */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <MessageSquare className="h-12 w-12 mx-auto opacity-50" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Template Composer Modal */}
      {showTemplateComposer && (
        <TemplateComposer
          onClose={() => setShowTemplateComposer(false)}
          onSend={(templateId, recipient) => {
            // Handle template send
            setShowTemplateComposer(false);
          }}
        />
      )}
    </div>
  );
}

