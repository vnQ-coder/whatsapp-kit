import "./globals.css";
import { QueryProvider } from "../components/providers/query-provider";
import { ClientThemeProvider } from "../components/providers/client-theme-provider";
import { Toaster } from "../components/ui/toaster";

export const metadata = {
  title: "WhatsApp Kit - SaaS Platform",
  description: "WhatsApp messaging automation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientThemeProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
