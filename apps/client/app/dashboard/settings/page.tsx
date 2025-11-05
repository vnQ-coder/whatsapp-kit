"use client";

import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Separator } from "../../../components/ui/separator";
import { Moon, Sun, User, Key, CreditCard, Monitor } from "lucide-react";
import { useTheme } from "../../../components/providers/theme-provider";
import { useToast } from "../../../hooks/use-toast";

export default function SettingsPage() {
  const { theme, resolvedTheme, fontSize, setTheme, setFontSize } = useTheme();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="api-keys">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="appearance">
            {resolvedTheme === "dark" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  defaultValue=""
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">WhatsApp API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    defaultValue="wsk_••••••••••••••••"
                    readOnly
                  />
                  <Button variant="outline">Reveal</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  defaultValue="https://api.example.com/webhook"
                />
              </div>
              <Button>Save API Keys</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">
                        $99/month
                      </p>
                    </div>
                    <Button variant="outline">Upgrade</Button>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expires 12/25
                  </p>
                </div>
              </div>
              <Button>Update Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => {
                      setTheme("light");
                      toast({
                        title: "Theme updated",
                        description: "Theme changed to light mode",
                      });
                    }}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => {
                      setTheme("dark");
                      toast({
                        title: "Theme updated",
                        description: "Theme changed to dark mode",
                      });
                    }}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => {
                      setTheme("system");
                      toast({
                        title: "Theme updated",
                        description: "Theme set to system preference",
                      });
                    }}
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
                {theme === "system" && (
                  <p className="text-xs text-muted-foreground">
                    Currently using {resolvedTheme} mode (system preference)
                  </p>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex gap-2">
                  <Button
                    variant={fontSize === "sm" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFontSize("sm");
                      toast({
                        title: "Font size updated",
                        description: "Font size changed to small",
                      });
                    }}
                  >
                    Small
                  </Button>
                  <Button
                    variant={fontSize === "md" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFontSize("md");
                      toast({
                        title: "Font size updated",
                        description: "Font size changed to medium",
                      });
                    }}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={fontSize === "lg" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFontSize("lg");
                      toast({
                        title: "Font size updated",
                        description: "Font size changed to large",
                      });
                    }}
                  >
                    Large
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current font size: {fontSize}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

