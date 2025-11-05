"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ className, length = 6, value = "", onChange, ...props }, ref) => {
    const [otp, setOtp] = React.useState<string[]>(
      value.split("").slice(0, length)
    );
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    React.useEffect(() => {
      if (value) {
        const newOtp = value.split("").slice(0, length);
        setOtp(newOtp);
      }
    }, [value, length]);

    const handleChange = (index: number, newValue: string) => {
      if (newValue.length > 1) {
        // Handle paste
        const pastedValues = newValue.slice(0, length).split("");
        const newOtp = [...otp];
        pastedValues.forEach((val, i) => {
          if (index + i < length && /^\d$/.test(val)) {
            newOtp[index + i] = val;
          }
        });
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        const nextIndex = Math.min(index + pastedValues.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
        return;
      }

      if (!/^\d$/.test(newValue) && newValue !== "") return;

      const newOtp = [...otp];
      newOtp[index] = newValue;
      setOtp(newOtp);
      onChange?.(newOtp.join(""));

      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
              if (ref) {
                if (typeof ref === "function") ref(el);
                else (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background text-center text-lg font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
        ))}
      </div>
    );
  }
);
InputOTP.displayName = "InputOTP";

export { InputOTP };

