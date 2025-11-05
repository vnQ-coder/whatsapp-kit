"use client";

import { ChatbotFlowBuilder } from "../../../components/chatbot/chatbot-flow-builder";
import { PageHeader } from "../../../components/common/PageHeader";

export default function ChatbotFlowPage() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="Chatbot Flow Builder"
        description="Design and build your WhatsApp chatbot conversation flows"
      />
      <div className="flex-1 min-h-0">
        <ChatbotFlowBuilder />
      </div>
    </div>
  );
}

