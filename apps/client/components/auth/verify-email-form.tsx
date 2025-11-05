"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../common/Button";
import { InputOTP } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";

export function VerifyEmailForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Code resent!",
        description: "A new verification code has been sent to your email.",
      });
      setCountdown(60);
      setCode("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-3">
              <MessageCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">WhatsApp Kit</h1>
              <p className="text-sm text-muted-foreground">SaaS Platform</p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Verify your email
            </h2>
            <p className="text-lg text-muted-foreground">
              We've sent a verification code to your email address. Please enter
              the code below to complete your registration.
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <p className="font-medium">Check your inbox</p>
              <p className="text-muted-foreground">
                Code sent to your email address
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Verify Email Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-3">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">WhatsApp Kit</h1>
                <p className="text-xs text-muted-foreground">SaaS Platform</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Verify your email</h2>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify();
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-center block">
                    Verification Code
                  </Label>
                  <InputOTP
                    length={6}
                    value={code}
                    onChange={setCode}
                    className="mx-auto"
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || code.length !== 6}
                >
                  {isLoading ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify email
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="text-center text-sm">
                  <p className="text-muted-foreground mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={isResending || countdown > 0}
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : countdown > 0 ? (
                      `Resend code in ${countdown}s`
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend code
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

