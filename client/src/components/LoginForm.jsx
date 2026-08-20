"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    login.mutate(form, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            value={form.email}
            onChange={handleChange}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            value={form.password}
            onChange={handleChange}
            className="pr-9 pl-9"
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
        <a href="#" className="text-sm text-muted-foreground hover:text-brand-navy-dark">
          Forgot password?
        </a>
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
