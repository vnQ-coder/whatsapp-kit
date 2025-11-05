"use client";

import { InboxView } from "../../../components/inbox/inbox-view";
import { PageHeader } from "../../../components/common/PageHeader";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox"
        description="Manage your WhatsApp conversations and groups"
      />
      <div className="h-[calc(100vh-12rem)]">
        <InboxView />
      </div>
    </div>
  );
}

