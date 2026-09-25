"use client";

import { useState } from "react";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useLogin";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm({ onSuccess }) {
  const [method, setMethod] = useState("email"); // "email" | "phone"
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    const body =
      method === "email"
        ? { email: contact, password }
        : { telephone: contact, password };
    login.mutate(body, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Method toggle */}
      <div className="flex rounded-lg border border-border bg-brand-input/60 p-1">
        {[
          { id: "email", label: "Email" },
          { id: "phone", label: "Phone number" },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => { setMethod(opt.id); setContact(""); }}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              method === opt.id
                ? "bg-white text-brand-navy-dark shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Contact field */}
      <div className="space-y-2">
        <Label htmlFor="login-contact">
          {method === "email" ? "Email" : "Phone number"}
        </Label>
        <div className="relative">
          {method === "email"
            ? <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            : <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          }
          <Input
            id="login-contact"
            type={method === "email" ? "email" : "tel"}
            placeholder={method === "email" ? "you@example.com" : "+237 670 000 000"}
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="pl-9"
            autoComplete={method === "email" ? "email" : "tel"}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-9 pl-9"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-brand-navy-dark">
          Forgot password?
        </Link>
      </div>

      {login.isError && <p className="text-sm text-destructive">{login.error.message}</p>}

      <Button
        type="submit"
        className="w-full bg-brand-navy text-white transition-transform hover:scale-[1.02] hover:bg-brand-navy/90"
        disabled={login.isPending}
      >
        {login.isPending ? "Logging in…" : "Sign In"}
      </Button>
    </form>
  );
}
