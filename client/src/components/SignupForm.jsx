"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useSignup } from "@/hooks/useSignup";

export function SignupForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const signup = useSignup();

  function handleSubmit(event) {
    event.preventDefault();
    signup.mutate(
      { email, telephone: telephone || null, password },
      { onSuccess: () => onSuccess?.({ email }) },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">Your verification code will be sent here.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Phone number <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <PhoneInput
          id="telephone"
          name="telephone"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">Used only as contact information, not for verification.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {signup.isError && <p className="text-sm text-destructive">{signup.error.message}</p>}

      <Button
        type="submit"
        className="w-full bg-brand-navy text-white transition-transform hover:scale-[1.02] hover:bg-brand-navy/90"
        disabled={signup.isPending}
      >
        {signup.isPending ? "Sending code..." : "Create account"}
      </Button>
    </form>
  );
}
