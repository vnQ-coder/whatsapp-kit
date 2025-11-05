"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Video,
  FileText,
  X,
  MoreVertical,
  Phone,
  VideoIcon,
  Users,
  Info,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../common/Button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { Conversation, Message } from "./inbox-view";

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hello! I'm interested in your WhatsApp service.",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      senderId: "user1",
      senderName: "John Doe",
      status: "read",
      type: "text",
    },
    {
      id: "2",
      text: "Thanks for reaching out! How can I help you today?",
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      senderId: "me",
      senderName: "You",
      status: "read",
      type: "text",
    },
    {
      id: "3",
      text: "I'd like to know more about your pricing plans.",
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      senderId: "user1",
      senderName: "John Doe",
      status: "read",
      type: "text",
    },
    {
      id: "4",
      text: "Sure! Let me send you our pricing information.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      senderId: "me",
      senderName: "You",
      status: "read",
      type: "text",
    },
    {
      id: "5",
      text: "Thanks for the update!",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      senderId: "user1",
      senderName: "John Doe",
      status: "read",
      type: "text",
    },
  ],
};

interface ChatWindowProps {
  conversation: Conversation;
  onClose?: () => void;
}

export function ChatWindow({ conversation, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    mockMessages[conversation.id] || []
  );

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date(),
      senderId: "me",
      senderName: "You",
      status: "sent",
      type: "text",
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 2000);
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-message-delivered" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-message-read" />;
      case "failed":
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-card">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>
              {conversation.type === "group" ? (
                <Users className="h-5 w-5" />
              ) : (
                conversation.name.charAt(0).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">
                {conversation.name}
              </h3>
              {conversation.type === "group" && (
                <Badge variant="secondary" className="text-xs">
                  {conversation.participants?.length || 0} members
                </Badge>
              )}
            </div>
            {conversation.type === "individual" && (
              <p className="text-xs text-muted-foreground truncate">
                {conversation.phoneNumber}
                {conversation.isOnline && (
                  <span className="ml-2 text-online">Online</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conversation.type === "individual" && (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <VideoIcon className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Info className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                View Group Info
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Export Chat
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <X className="mr-2 h-4 w-4" />
                Archive Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === "me";
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                {!isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2",
                    isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {msg.senderName}
                    </p>
                  )}
                  {msg.type === "template" && msg.templateName && (
                    <Badge
                      variant="secondary"
                      className="mb-2 text-xs"
                    >
                      Template: {msg.templateName}
                    </Badge>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                  <div
                    className={cn(
                      "flex items-center gap-1 mt-1 text-xs",
                      isMe ? "justify-end" : "justify-start"
                    )}
                  >
                    <span className="opacity-70">
                      {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                    </span>
                    {isMe && (
                      <span className="ml-1">{getStatusIcon(msg.status)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Paperclip className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem>
                <ImageIcon className="mr-2 h-4 w-4" />
                Photo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Video className="mr-2 h-4 w-4" />
                Video
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 min-w-0"
          />

          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="icon"
            className="h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

