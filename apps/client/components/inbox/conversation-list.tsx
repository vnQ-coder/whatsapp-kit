"use client";

import { formatDistanceToNow } from "date-fns";
import { Users, MessageSquare, Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { Conversation } from "./inbox-view";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="divide-y">
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">
          No conversations found
        </div>
      ) : (
        conversations.map((conversation) => {
          const isSelected = selectedConversation?.id === conversation.id;
          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={cn(
                "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                isSelected && "bg-muted"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>
                      {conversation.type === "group" ? (
                        <Users className="h-6 w-6" />
                      ) : (
                        conversation.name.charAt(0).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.type === "individual" && conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-online border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {conversation.name}
                      </h3>
                      {conversation.type === "group" && (
                        <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    {conversation.lastMessageTime && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(conversation.lastMessageTime, {
                          addSuffix: true,
                        }).replace("about ", "")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="h-5 min-w-5 rounded-full px-1.5 text-xs flex items-center justify-center"
                      >
                        {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

